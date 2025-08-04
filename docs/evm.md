### Storage during Transaction execution

- calldata vs memory vs storage
    - calldata
        - data field inside the transaction
        - immutable, read only
        - type only allowed in input parameters for external functions
            - type means that the variable is not copied to memory / storage.
            - cheaper than memory / storage
    - memory
        - mutable
        - function specific temporary memory
        - when used in function input argument type, it means that the variable is being copied to the internal memory once the function is called
    - storage
        - mutable, permanent storage
        - very expensive

### Proof of Stake:

- active validator set vs entry queue and exit queue
- full lifecycle of a validator
    - set stake -> pending validator set -> active validator -> exit queue -> exitted
- how the exit process works
    - 2 phase exit
        - active validator -> exit queue -> withdrawable period -> withdrawable sweep
- understanding staking
    - native staking
        - stake / block rewards in beacon chain
    - liquid staking (LST - liquid staking token)
        - via 3rd party (lido, coinbase, rocketpool)
- beacon chain
- LST (liquid staking token)
    - 2 types:
        - value accruing
        - rebasing
