import { TEST_SDK_DEFINITION, TestSdk } from "./model";
import { SdkDefinition, SdkFactory } from "..";
import { TestSdkImpl } from "./impl";

export class testSdkFactory implements SdkFactory<TestSdk> {
    public definition: SdkDefinition = TEST_SDK_DEFINITION;

    constructor() {}

    public getSdk(): TestSdk {
        return new TestSdkImpl();
    }
}
