# ENS

### basics + myths:

.eth domains have nothing to do with ethopia. ethopia uses .et domain.
the ENS resolution is done onchain via contracts. and is not supported by browers. however, browsers can use gateway services (like .eth.limo) to resolve the ens and fetch website data via ipfs.

Also, while .eth domains are not natively supported by browsers, ICANN does not have the authority to sell those domains on the free market. basically not any word can be used as a TLD, and only certain ones are available to be used. therefore, the .eth domains will always just refer to ENS domains.

## documentation

### Intro

### the protocol

eth registrar
dns + ens
subnames
ens manager app

### deployments

ens is multichain

### resolution

forward resolution (ens -> all records)
reverse resolution (address -> ens)

### dns names

### using ens

### smart contracts

---

Code: https://discuss.ens.domains/t/a-map-of-all-ens-contracts/10754

registry: `0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e`

the most important contract is the ENSRegistry contract.

### Resolution:

ENS Resolution is a two step process:

- first fetch the resolver address using the registry
- then query the resolver for the underlying data

The ENSRegistry contains the mapping to resolvers for both forward and reverse resolution.

### Name processing

Name Normalization (namehash algorithm)

Reverse resoluion namehash algoirthm

DNS Encoding algorithm (used for wrapped ENS)

### Resolvers

# ENS CONTRACTS

- root
    - Ownable
    - Controllable
    - Root
- utils
    - NameEncoder
- reverseRegistrar
- resolvers
- registry
- ethregistrar
- dnssec-oracle
- dnsregistrar
