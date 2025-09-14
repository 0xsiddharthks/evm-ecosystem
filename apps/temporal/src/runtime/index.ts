import {
    NativeConnection,
    NativeConnectionOptions,
    Worker,
} from "@temporalio/worker";
import { SdkFactory } from "../sdks";
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
        // TODO: support chain SDK factories
        sdkFactories: SdkFactory<unknown>[];
    };
    workflowsPath: string;
}) => {
    let activities: Parameters<typeof Worker.create>[0]["activities"];

    if (args.sdks) {
        const activitiesList = createSdkActivities(args.sdks.sdkFactories);
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
