import { TestSdk } from "../model";

export class TestSdkImpl implements TestSdk {
    constructor() {}

    public async incrementNumber(input: number): Promise<number> {
        return input + 1;
    }
}
