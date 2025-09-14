import { TEST_CHAIN_SDK_DEFINITION, TestChainSdk } from "./model";
import { SdkDefinition, ChainSdkFactory } from "..";
import { TestChainSdkImpl } from "./impl";
import { chainNameToViemChainMap } from "./impl/utils";

export class testChainSdkFactory implements ChainSdkFactory<TestChainSdk> {
    public definition: SdkDefinition = TEST_CHAIN_SDK_DEFINITION;

    constructor() {}

    public getSdk(chainName: string): TestChainSdk {
        return new TestChainSdkImpl({ chainName });
    }
}
