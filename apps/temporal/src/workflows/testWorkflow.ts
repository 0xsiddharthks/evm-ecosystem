import { testSdkFactoryProxyActivities } from "../proxyActivities";
import * as wf from "@temporalio/workflow";

interface workflowArgs {
    input: number;
}

export const testWorkflow = async (args: workflowArgs) => {
    wf.log.info("test workflow started");

    const incrementedNumber = await testSdkFactoryProxyActivities
        .getSdk()
        .incrementNumber(args.input);

    wf.log.info(`sdk response: , ${incrementedNumber}`);

    return;
};
