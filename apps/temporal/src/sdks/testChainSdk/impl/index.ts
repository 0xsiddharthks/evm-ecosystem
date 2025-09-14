import { TestChainSdk } from "../model";
import { createPublicClient, http } from "viem";
import type { Chain } from "viem";
import { chainNameToViemChainMap } from "./utils";

export class TestChainSdkImpl implements TestChainSdk {
    private viemChainName: Chain;

    constructor(options: { chainName: string }) {
        this.viemChainName = chainNameToViemChainMap[options.chainName];
    }

    private getClient = () =>
        createPublicClient({
            transport: http(),
            chain: this.viemChainName,
        });

    public async getLatestBlockNumber(): Promise<number> {
        const client = this.getClient();

        const blockNumber = await client.getBlockNumber();
        return Number(blockNumber.toString());
    }
}
