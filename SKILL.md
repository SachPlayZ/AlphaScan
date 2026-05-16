---
name: 0g-dev
description: >
  Use this skill whenever working on projects that deploy to, integrate with, or
  overhaul code targeting the 0G blockchain ecosystem. Triggers include: any
  mention of "0G", "0g.ai", "Galileo testnet", "0G Compute", "0G Storage",
  "0G DA", "0G Router", "evmrpc-testnet.0g.ai", deploying contracts to 0G Chain,
  integrating AI inference via the 0G Compute Router, or migrating/refactoring
  an existing project to run on 0G. Always consult this skill before touching
  hardhat.config.js, foundry.toml, RPC endpoints, chain IDs, or any code that
  calls the 0G Compute Router API.
---

# 0G Developer Skill

Reference for building, deploying, and integrating with the 0G blockchain
ecosystem (EVM-compatible chain + decentralised AI compute + storage + DA).

---

## 1. Network Configuration

### Testnet — 0G Galileo

| Parameter       | Value                                     |
|-----------------|-------------------------------------------|
| Network Name    | 0G-Galileo-Testnet                        |
| Chain ID        | **16602**                                 |
| Token Symbol    | 0G                                        |
| Dev RPC         | `https://evmrpc-testnet.0g.ai` *(dev only — not for production)* |
| Block Explorer  | `https://chainscan-galileo.0g.ai`         |
| Storage Explorer| `https://storagescan-galileo.0g.ai`       |
| Faucet          | `https://faucet.0g.ai` (0.1 0G/day limit) |
| Faucet (GCP)    | `https://cloud.google.com/application/web3/faucet/0g/galileo` |

**Production RPCs (testnet):** QuickNode, ThirdWeb, Ankr, dRPC NodeCloud  
→ Always swap `evmrpc-testnet.0g.ai` for a 3rd-party RPC before shipping.

### Mainnet

| Parameter    | Value                          |
|--------------|--------------------------------|
| Chain ID     | **16661**                      |
| RPC          | `https://evmrpc.0g.ai`         |
| Block Explorer | `https://chainscan.0g.ai`    |

---

## 2. Smart Contract Deployment

### Compiler Requirements

**Always use `--evm-version cancun`** — 0G Chain supports Pectra & Cancun-Deneb.

```js
// hardhat.config.js
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    testnet: {
      url: "https://evmrpc-testnet.0g.ai",
      chainId: 16602,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: "https://evmrpc.0g.ai",
      chainId: 16661,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

```toml
# foundry.toml
[profile.default]
evm_version = "cancun"

[rpc_endpoints]
0g_testnet = "https://evmrpc-testnet.0g.ai"
0g_mainnet  = "https://evmrpc.0g.ai"
```

### Deploy Commands

```bash
# Hardhat
npx hardhat run scripts/deploy.js --network testnet

# Foundry
forge create --rpc-url https://evmrpc-testnet.0g.ai \
  --private-key $PRIVATE_KEY \
  --evm-version cancun \
  src/MyContract.sol:MyContract \
  --constructor-args <ARGS>

# Truffle
truffle migrate --network 0g-testnet
```

### Contract Verification (Hardhat)

Install: `npm install --save-dev @nomicfoundation/hardhat-verify dotenv`

Add to `hardhat.config.js`:
```js
etherscan: {
  apiKey: { testnet: "ANY_PLACEHOLDER", mainnet: "ANY_PLACEHOLDER" },
  customChains: [
    {
      network: "testnet",
      chainId: 16602,
      urls: {
        apiURL: "https://chainscan-galileo.0g.ai/open/api",
        browserURL: "https://chainscan-galileo.0g.ai",
      },
    },
    {
      network: "mainnet",
      chainId: 16661,
      urls: {
        apiURL: "https://chainscan.0g.ai/open/api",
        browserURL: "https://chainscan.0g.ai",
      },
    },
  ],
},
```

```bash
npx hardhat verify DEPLOYED_CONTRACT_ADDRESS --network testnet
```

### Key Contract Addresses (Testnet — may change)

| Contract    | Address                                      |
|-------------|----------------------------------------------|
| Storage Flow | `0x22E03a6A89B950F1c82ec5e74F8eCa321a105296` |
| Storage Mine | `0x00A9E9604b0538e06b268Fb297Df333337f9593b` |
| Storage Reward | `0xA97B57b4BdFEA2D0a25e535bd849ad4e6C440A69` |
| DA Entrance  | `0xE75A073dA5bb7b0eC622170Fd268f35E675a957B` |

### Precompiles

| Precompile     | Address      | Purpose                        |
|----------------|--------------|--------------------------------|
| DASigners      | `0x...1000`  | Data availability signatures   |
| Wrapped0GBase  | `0x...1002`  | Wrapped 0G token operations    |

### Troubleshooting

- **"invalid opcode"** → add `evmVersion: "cancun"` to compiler settings, or downgrade Solidity to `0.8.19`.
- **Can't connect to RPC** → switch to a 3rd-party RPC (QuickNode / ThirdWeb).

---

## 3. 0G Compute Router

The Router is an OpenAI-compatible API gateway over the 0G Compute Network. No SDK needed — just swap `base_url` and `api_key`.

### Base URLs

| Network  | Web UI                       | API Endpoint                                          |
|----------|------------------------------|-------------------------------------------------------|
| Mainnet  | `pc.0g.ai`                   | `https://router-api.0g.ai/v1`                         |
| Testnet  | `pc.testnet.0g.ai`           | `https://router-api-testnet.integratenetwork.work/v1` |

### OpenAI SDK Drop-in

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://router-api.0g.ai/v1",   # or testnet URL
    api_key="YOUR_0G_API_KEY",
)

response = client.chat.completions.create(
    model="<model-id-from-catalog>",
    messages=[{"role": "user", "content": "Hello"}],
)
```

```js
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://router-api.0g.ai/v1",
  apiKey: process.env.OG_API_KEY,
});
```

### Router vs Direct

| | Router | Direct |
|---|---|---|
| Setup | API key only | Install SDK + manage wallet keys |
| Provider management | Automatic routing + failover | Manual selection & funding |
| Billing | Single on-chain balance | Per-provider sub-accounts |
| API shape | OpenAI / Anthropic compatible | Custom SDK calls |
| Best for | Server-side apps, agents, prototypes | Browser dApps, direct chain access |

### Getting an API Key

1. Go to `pc.0g.ai` (mainnet) or `pc.testnet.0g.ai` (testnet)
2. Connect wallet
3. Deposit 0G tokens
4. Create API key (three permission tiers available)

### Migration Note

Funds from the old `compute-marketplace.0g.ai` live in **per-provider sub-accounts** under the Direct flow — they do **not** appear in Router balance. To access them in the new UI, enable **Advanced Mode** (toggle top-right on pc.0g.ai).

---

## 4. Checklist: Overhauling a Project for 0G

When migrating or refactoring an existing project to target 0G:

- [ ] Update `hardhat.config.js` / `foundry.toml` with correct Chain IDs and RPCs (see §2)
- [ ] Set `evmVersion: "cancun"` in all compiler configs
- [ ] Replace any hardcoded Ethereum/other chain IDs with `16602` (testnet) or `16661` (mainnet)
- [ ] Swap OpenAI/Anthropic `base_url` for the 0G Router endpoint (see §3)
- [ ] Replace OpenAI/Anthropic API keys with `OG_API_KEY` env var
- [ ] Check contract addresses against the testnet table above (§2) — they may change
- [ ] Add contract verification config to `hardhat.config.js` (§2)
- [ ] Ensure `.env` includes `PRIVATE_KEY` and `OG_API_KEY`
- [ ] Switch from dev RPC to 3rd-party RPC before deploying to production

---

## 5. Reference Links

| Resource | URL |
|---|---|
| Full docs | `https://docs.0g.ai` |
| Deployment scripts repo | `https://github.com/0gfoundation/0g-deployment-scripts` |
| Testnet explorer | `https://chainscan-galileo.0g.ai` |
| Mainnet explorer | `https://chainscan.0g.ai` |
| Storage explorer | `https://storagescan-galileo.0g.ai` |
| Faucet | `https://faucet.0g.ai` |
| Compute Router UI (mainnet) | `https://pc.0g.ai` |
| Compute Router UI (testnet) | `https://pc.testnet.0g.ai` |
| Discord | `https://discord.gg/0glabs` |
| Builder Hub | `https://build.0g.ai` |
