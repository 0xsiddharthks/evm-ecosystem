### [OP Chain Architecture](https://docs.optimism.io/operators/chain-operators/architecture)

- like ethereum, op stack also uses separation between execution and consensus clients

![](https://docs.optimism.io/_next/image?url=%2Fimg%2Fbuilders%2Fchain-operators%2Fsequencer-diagram.png&w=828&q=75)


- permissioned components:
    - `op-geth` implements l2 execution layer
    - `op-node` similar to l1 beacon node. implements rollup specific functionality as the l2 consensus layer. it is stateless and gets it’s world view from `op-geth`
    - `op-batcher` submits l2 sequencer data to l1
    - `op-deployer` tool that simplifies the process of deploying standardized op stack chains. acts as a layer to standardize intent → matching op superchain spec. allows chains to use superchain wide contracts
    - `op-proposer` submits the output roots to l1. enables trustless l2→l1 messaging
- sequencer (`op-node` + `op-geth`)
    - responsible for ordering and executing transactions on l2. builds blocks, runs the evm, and sends the resulting commitments / data to eth.
    - should handle `eth_sendRawTransaction` RPC call.
    - sequencer runs in isolation from the internet and peers exclusively with internal replica nodes.
    - has a shared mempool with replicas for efficient transaction handling.
    - replica nodes are peered to the sequencer and help horizontally scaling rpc requests
    - rollup needs atleast 1 archival l2 (replica) node connected to the proposer, since the data it needs could be historical.
- bootnodes
- offchain components
    - `op-conductor` rpc aware 
    - `op-challenger`
    - `l1-nodes` required to interface with the l1
- 