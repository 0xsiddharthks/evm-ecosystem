### finality, epoch, and slots
- slot
	- 12 second tick
	- one validator is chosen to propose a block, while others (in committee) attest to it.
	- slots can have no blocks
- epoch
	- batch of 32 slots. (not a rolling window)
	- give use "checkpoints" which finalize state.
	- last epoch: justified. before that: finalized
	- rewards processed in first slot after every epoch
- ethereum consensus
	- `gasper`
	- combines `LMD-GHOST` for instant forks, with `Casper FFG` for slower finality

### op stack fork choice levels (heads)
- 3 parallel notions of L2 tip
	- unsafe head (instant UX)
		- latest block from sequencer.
		- also includes transactions from l1 head (not finalized)
	- safe head (protocol correctness)
		- l2 blocks for which data and ordering is anchored on l1
		- can reorg
	- finalized head (bridges / withdrawls)
		- l2 state derived from finalized l1