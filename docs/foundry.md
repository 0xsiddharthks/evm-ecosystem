## Anvil

Local Ethereum node

## Forge

Used to build, test, deploy, verify solidity contracts important commands:

- deploy: `forge create --rpc-url 127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 src/FirstApp.sol:Counter`

## Cast

Used to interact with chain. Can call / send transactions / get chain data important commands:

- send transaction: `cast send 0x5FbDB2315678afecb367f032d93F642f64180aa3 --rpc-url 127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 "inc()"`
- call: `cast call 0x5FbDB2315678afecb367f032d93F642f64180aa3 --rpc-url 127.0.0.1:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 "inc()"`

## Chisel

Solidity REPL
