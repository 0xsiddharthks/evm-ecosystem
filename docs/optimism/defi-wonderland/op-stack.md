### overview

- l2 posts two things to l1:
    - data
    - state commitments
- layers in l2: execution, consensus, settlement

### previous knowledge

- state commitments
    - cryptographic commitments of l2 state snapshot
    - allow contracts on l1 trust data from l2
    - these are posted without verification (in case of optimistic rollups), and so are valid only after fraud proof period

    ```tsx
    commitment =
        HASH(
            l2 state root,
            storage root of withdrawl contract, // TODO: figure out what this means!
            latest block hash,
            version number
        )
    ```

    - the commitment is thus not just a snapshot of the current state, but is a summary of all the things that matter for interoperability:
        - whether a withdrawl was initiated
        - what block it came from
        - how it ties back to the current l1
    - in order for the commitment to be trustworthy:
        - the da layer contains the data needed to reconstruct the transition
        - the derivation function is deterministic and public
        - fraud proof system works
    - data availability can be anywhere:
        - offchain (e.g. celestia / eigenDA)
        - ethereum EIP4484 DA
        - ethereum calldata
    - DA platform might be using different data availability techiques:
        - sampling (in case of erasure coded blobs)
        - quorum of online nodes
    - core point of DA is to be able to reconstruct the state if you're not the sequencer
        - sequencer is the component responsible for ordering and executing transactions on the L2.
    - most l2 chains have a single sequencer (including optimism and arbitrum). Primary reason is simplicity
        - next step is to have a decentralized consensus across a distributed set of sequencers
        - final solution would be to have a "shared sequencer" model, where a single decentralized network of sequencers could serve multiple rollups.
        - based rollups (TODO: research)
    - in case of OP, the sequencer is running the full OP stack:
        - op-node
        - op-geth
        - op-batcher
        - op-proposer
- reorgs
	- [[finality]]
- modular rollup architecture
    - ethereum originally was a monothic chain: so every node was doing everything.
        - it was only post the MERGE and POS, that we decoupled them. (since POW required all nodes to do everything)
    - current layers in OP:
        - data availability layer: ensures that transaction data is published and retrievable
        - consensus layer: orders transactions and helps generate blocks
        - execution layer: takes transactions and computes new state
        - settlement layer: validates claims about system from outside (typically on l1)
![](https://optimism.handbook.wonderland.xyz/assets/images/modularity-54b039e28adaedcc43cc5bb2463b2067.png)
### op stack

- [modular rollup theory](https://www.youtube.com/watch?v=jnVjhp41pcc)
    - timeline:
        - initially, everyone was building monolithic rollups.
        - people built rollup proofs first and then built the rest of the system around it.
        - step 1: separating proofs from execution.
            - optimism's EVM equivalance upgrade
            - arbitrum's nitro upgrade
        - step 2: separating DA layer
            - metis forked optimism and added a DA committee
            - arbitrum releases nova with a DA committee
        - current state post step 2:
	        - consensus
	        - data availability
	        - derivation
	        - execution
	        - settlement
    - formalizing layers:
        - data availability layer:
            - ordered list of blobs. (append only list)
            - `type da : bytes[]`
            - examples:
                - ethereum calldata
                - ethereum 4844
                - celestia
        - derivation
            - take the da layer and current state of rollup, and produces `inputs to chain (payload)`
            - op stack uses engine API.
                - this is defined as part of ethereum, and acts as the standardized interface that enables communication between consensus layer and execution layer.
                - it is a collection of JSON-RPC methods that allow the consensus layer to command and receive information from the execution layer.
                - how the engine api works in practice:
                    - As an execution client, Geth implements the server-side of the Engine API. This means it listens for instructions from a consensus layer client. When a consensus client needs to propose a new block, it uses the Engine API to send a "payload" of transactions to Geth. Geth then executes these transactions, updates its local state, and reports the results back to the consensus layer.
            - `derive: (S(prev), DA) => payload or null`
            - null if there is no transaction in the block
        - derivation in bedrock
- consensus layer
    - consumes and interprets the data published to ethereum
    - includes:
        - data availability
            - the raw input that describe what happened in the rollup
            - `type DA = bytes[];`
            - effectively, it's an ordered list of blobs or calldata entries
            - data should be append only and publicly accessible

> [!warning]
> read more!

- derivation
	- `derive(S_prev, DA) → { payload | null }`
	- pulls data from 3 sources:
		- sequencer batches
		- l1 deposits
		- 1l block metadata
	- working in practice:
		- `op-node` (consensus) pulls data from the 3 sources, in order to derive the payload for the next block.
		- then uses `engine-api` to send the payload to `op-geth` (execution) for execution
- execution layer
	- geth fork with rollup logic
	- `execute(S_prev, payload) → S_next`
	- main difference is support for special transaction types (deposit tx from l1 -> l2)
	- ![](https://optimism.handbook.wonderland.xyz/assets/images/diagram-de85dcf9d5a9137560c6089d2ca30b36.png)
- settlement layer
	- `valid(S_p, S_n, DA, derive, execute) → boolean`
	- in order to prove the commitment, we also need to get the data from the DA.
		- `getBlobByIndex(uint256 index) → bytes`
- summary
	- ![](https://optimism.handbook.wonderland.xyz/assets/images/flow-7c2882e804f013b211a3714aebd8f0f2.png)
	- components:
		- DA -> op-batcher
		- sequencing -> op-node and op-geth
		- derivation -> op-node
		- execution -> op-geth
		- settlement -> l1 or offchain (op-challenger, dispute)

### deposit flow
- `deposit transaction` refers to any L2 transaction that is trigerred by a tx / event on L1
- 

### withdrawl flow

### evm vs op

### precompiles and predeploys

### preinstalls

### wrapping up