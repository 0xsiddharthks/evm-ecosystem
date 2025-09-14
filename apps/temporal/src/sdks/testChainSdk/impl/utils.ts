import { Chain, mainnet } from "viem/chains";

export const chainNameToViemChainMap: { [chainName: string]: Chain } = {
    ethereum: mainnet,
};
