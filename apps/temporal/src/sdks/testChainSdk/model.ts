import { SdkDefinition } from "..";

export interface TestChainSdk {
    getLatestBlockNumber(): Promise<number>;
}

export const TEST_CHAIN_SDK_DEFINITION: SdkDefinition = {
    name: "TestChainSdk",
    methods: [
        {
            methodName: "getLatestBlockNumber",
        },
    ],
};
