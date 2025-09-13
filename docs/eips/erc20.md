# [ERC20](https://eips.ethereum.org/EIPS/eip-20)

## Core ABI:
- name // optional
- symbol // optional
- decimal // optional
- totalSupply
- balanceOf
- transfer // Transfer event
- transferFrom // Transfer event
- approve // Approval event
- allowance

### [Attack Vector from Approve/TransferFrom Method](https://docs.google.com/document/d/1YLPtQxZu1UAvO9cZ1O2RPXBbT0mooh4DYKjA_jp-RLM/edit?pli=1&tab=t.0#heading=h.m9fhqynw2xvt)
- attacker just has to frontrun the `approve` calls with a `transferFrom` call

#### Fixes:
- workaround (change allowance from n -> m)
    - first go `n -> 0`
    - then verify value not frontrun previously
    - then go `0 -> m`
        - if frontrun, do `0 -> m - n`

- API change
    - add `compareAndSet` approve method

- SafeERC20 (openzepellin)
    - `safeIncreaseAllowance` & `safeDecreaseAllowance` methods added

## Extensions
