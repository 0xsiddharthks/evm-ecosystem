import { SdkDefinition } from "..";

export interface TestSdk {
    incrementNumber(input: number): Promise<number>;
}

export const TEST_SDK_DEFINITION: SdkDefinition = {
    name: "TestSdk",
    methods: [
        {
            methodName: "incrementNumber",
        },
    ],
};
