import {
    testChainSdkFactoryProxyActivities,
    testSdkFactoryProxyActivities,
} from "../proxyActivities";
import * as wf from "@temporalio/workflow";

interface workflowArgs {
    input: number;
}

export const testWorkflow = async (args: workflowArgs) => {
    wf.log.info("test workflow started");

    const incrementedNumber = await testSdkFactoryProxyActivities
        .getSdk()
        .incrementNumber(args.input);

    const currentBlockNumber = await testChainSdkFactoryProxyActivities
        .getSdk("ethereum")
        .getLatestBlockNumber();

    wf.log.info(
        `sdk response: ${JSON.stringify({ incrementedNumber, currentBlockNumber })}`
    );

    return;
};
