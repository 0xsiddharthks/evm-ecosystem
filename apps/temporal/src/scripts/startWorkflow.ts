import { WorkerTaskQueues } from "../common/taskQueues";
import { getClient } from "../runtime/temporalClient";

import { parse } from "ts-command-line-args";

interface ScriptArgs {
    clusterUrl: string;
    namespace: string;
}

const args = parse<ScriptArgs>({
    clusterUrl: {
        type: String,
        defaultValue: "127.0.0.1:7233",
        optional: true,
    },
    namespace: {
        type: String,
        defaultValue: "default",
        optional: true,
    },
});

const main = async (args: ScriptArgs) => {
    const client = await getClient({
        namespace: args.namespace,
        clusterUrl: args.clusterUrl,
    });

    const handle = await client.start("testWorkflow", {
        workflowId: `testWorkflow-${new Date().toISOString()}`,
        taskQueue: WorkerTaskQueues.defaultWorkerTaskQueue,
        args: [
            {
                input: 1,
            },
        ],
    });

    console.log("Started Workflow: ", handle.workflowId);
};

main(args).catch((err) => {
    console.error(err);
    process.exit(1);
});
