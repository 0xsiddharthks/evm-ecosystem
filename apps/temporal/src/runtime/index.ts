import {
    NativeConnection,
    NativeConnectionOptions,
    Worker,
} from "@temporalio/worker";
import { ChainSdkFactory, SdkFactory } from "../sdks";
import { ActivityTaskQueues, WorkerTaskQueues } from "../common/taskQueues";

let nativeConnection: NativeConnection;

export const getNativeConnection = async (options: { clusterUrl: string }) => {
    if (!nativeConnection) {
        const nativeConnectionOptions: NativeConnectionOptions = {
            address: options.clusterUrl,
        };

        nativeConnection = await NativeConnection.connect(
            nativeConnectionOptions
        );
    }
    return nativeConnection;
};

const createSdkActivities = (
    sdkFactories: SdkFactory<unknown>[]
): { [key: string]: (...args: any[]) => any }[] =>
    sdkFactories.map((sdkFactory) => {
        const res: { [key: string]: (...args: any[]) => any } = {};
        let sdk: {};

        sdkFactory.definition.methods.forEach((method) => {
            res[`${sdkFactory.definition.name}-${method.methodName}`] = async (
                ...args: any[]
            ) => {
                if (!sdk) {
                    sdk = sdkFactory.getSdk();
                }
                return sdk[method.methodName].bind(sdk)(...args);
            };
        });
        return res;
    });

const createChainSdkActivities = (
    chainNames: string[],
    chainSdkFactories: ChainSdkFactory<unknown>[]
): { [key: string]: (...args: any[]) => any }[] =>
    chainSdkFactories.map((chainSdkFactory) => {
        const res: { [key: string]: (...args: any[]) => any } = {};
        let chainSdk: { [key: string]: {} } = {};

        for (const chainName of chainNames) {
            chainSdkFactory.definition.methods.forEach((method) => {
                res[
                    `${chainSdkFactory.definition.name}-${chainName}-${method.methodName}`
                ] = async (...args: any[]) => {
                    if (!chainSdk[chainName]) {
                        chainSdk[chainName] = chainSdkFactory.getSdk(chainName);
                    }
                    return chainSdk[chainName][method.methodName].bind(
                        chainSdk[chainName]
                    )(...args);
                };
            });
        }
        return res;
    });

const startActivityWorkers = async (args: {
    taskQueues: string[];
    temporalOptions: {
        clusterUrl: string;
        namespace: string;
    };
    activities?: object;
}) => {
    console.log("Registering Activity Workers");

    await Promise.all(
        args.taskQueues.map(async (taskQueue) => {
            console.log(
                `Registering activity worker for task queue: ${taskQueue}`
            );
            const connection = await getNativeConnection(args.temporalOptions);
            const worker = await Worker.create({
                taskQueue,
                activities: args.activities,
                namespace: args.temporalOptions.namespace,
                connection,
            });

            await worker.run();
            await connection.close();
        })
    );
};

const startWorkflowWorkers = async (args: {
    taskQueues: string[];
    temporalOptions: {
        clusterUrl: string;
        namespace: string;
    };
    workflowsPath: string;
    activities?: object;
}) => {
    console.log("Registering Workflow Workers");

    await Promise.all(
        args.taskQueues.map(async (taskQueue) => {
            console.log(
                `Registering workflow worker for task queue: ${taskQueue}`
            );
            const connection = await getNativeConnection(args.temporalOptions);
            const worker = await Worker.create({
                taskQueue,
                activities: args.activities,
                namespace: args.temporalOptions.namespace,
                connection,
                workflowsPath: require.resolve(args.workflowsPath),
            });

            await worker.run();
            await connection.close();
        })
    );
};

export const startWorkers = async (args: {
    taskQueues: {
        activity: string[];
        workflow: string[];
    };
    temporalOptions: {
        clusterUrl: string;
        namespace: string;
    };
    sdks?: {
        sdkFactories: SdkFactory<unknown>[];
        chainSdkFactories: ChainSdkFactory<unknown>[];
        chainNames: string[];
    };
    workflowsPath: string;
}) => {
    let activities: Parameters<typeof Worker.create>[0]["activities"];

    if (args.sdks) {
        const activitiesList = [
            ...createSdkActivities(args.sdks.sdkFactories),
            ...createChainSdkActivities(
                args.sdks.chainNames,
                args.sdks.chainSdkFactories
            ),
        ];

        activities = activitiesList.reduce(
            (acc, val) => ({
                ...acc,
                ...val,
            }),
            {}
        );
    }

    await Promise.all([
        startActivityWorkers({
            taskQueues: args.taskQueues.activity,
            temporalOptions: args.temporalOptions,
            activities,
        }),
        startWorkflowWorkers({
            taskQueues: args.taskQueues.workflow,
            temporalOptions: args.temporalOptions,
            activities,
            workflowsPath: args.workflowsPath,
        }),
    ]);
};
