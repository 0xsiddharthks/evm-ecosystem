import { startWorkers } from "./runtime";
import { ActivityTaskQueues, WorkerTaskQueues } from "./common/taskQueues";
import { testSdkFactory } from "./sdks/testSdk/factory";
import { testChainSdkFactory } from "./sdks/testChainSdk/factory";
import * as path from "path";

// TODO: move to environments
const TEMPORAL_LOCAL_CLUSTER_URL = "127.0.0.1:7233";
const TEMPORAL_LOCAL_NAMESPACE = "default";

export const run = async () => {
    console.log("Running Temporal Service");
    await startWorkers({
        taskQueues: {
            activity: [ActivityTaskQueues.defaultActivityTaskQueue],
            workflow: [WorkerTaskQueues.defaultWorkerTaskQueue],
        },
        temporalOptions: {
            clusterUrl: TEMPORAL_LOCAL_CLUSTER_URL,
            namespace: TEMPORAL_LOCAL_NAMESPACE,
        },
        sdks: {
            sdkFactories: [new testSdkFactory()],
            chainSdkFactories: [new testChainSdkFactory()],
            chainNames: ["ethereum"],
        },
        workflowsPath: path.join(__dirname, "./workflows/index"),
    });
};

run().catch((err) => console.error);
