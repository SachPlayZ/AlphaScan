# Scanio
## DeFAI Agent on 0G Chain — AI-powered crypto trading with decentralized compute

Scanio is a cutting-edge DeFAI (Decentralized Finance AI) agent that revolutionizes crypto trading by providing intelligent, data-driven insights and automated trading decisions. Built on the 0G blockchain ecosystem with AI inference powered by the 0G Compute Router.

Our platform combines Telegram signal monitoring, Twitter verification, and historical data analysis to deliver reliable trading opportunities — all on-chain on 0G.

## 🌟 Key Features

- **Multi-Source Alpha Collection**: Aggregates trading signals from Telegram channels
- **Cross-Platform Verification**: Validates signals against Twitter activity
- **Historical Analysis**: Performs comprehensive historical data analysis
- **Deterministic Validation**: Implements trust layers backed by real data
- **Autonomous Trading**: AI-powered decision making for buy/sell operations via 0G Compute
- **Transparent Operations**: Clear visibility into the decision-making process
- **0G Chain Native**: Smart contracts deployed on 0G Galileo (chain ID 16602), trades execute in 0G tokens

![Scanio System Overview](https://github.com/user-attachments/assets/e8a8951a-221b-4c1a-bdc1-a8d31de806b3)

*Scanio Backend System Architecture Overview*


## 🔒 Security & Trust

Scanio prioritizes security and transparency:
- Deterministic validation processes
- No reliance on synthetic data
- Clear audit trails for all decisions
- Multi-layer verification system

## 🏗️ Architecture

The project is built with a modern, scalable architecture:

### Backend (`tg-backend/`)
- Python-based Telegram signal processing
- Web3 integration for 0G Chain interactions
- Smart contract interaction utilities (Linking, DEAL, ALT tokens on 0G)
- AI inference via 0G Compute Router (OpenAI-compatible API)
- Signal validation and processing logic

### Frontend (`op-frontend/`)
- Next.js-based modern web application
- TypeScript for type safety
- Tailwind CSS for responsive design
- Real-time data visualization
- Wagmi + RainbowKit connected to 0G Galileo Testnet

### Contracts (`edu-map-mock/`)
- `Linking.sol` — maps wallet addresses to agent keypairs (on 0G chain)
- `MockToken.sol` (DEAL) — ERC20 trading token on 0G chain
- `MockToken2.sol` (ALT) — ERC20 trading token on 0G chain
- Hardhat configured for 0G Galileo testnet (chain ID 16602) and mainnet (16661)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- Telegram API credentials
- 0G API key (from [pc.0g.ai](https://pc.0g.ai) — connect wallet, deposit 0G, create key)
- 0G wallet with testnet tokens ([faucet.0g.ai](https://faucet.0g.ai))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/Scanio.git
cd Scanio
```

2. Deploy contracts to 0G Galileo testnet:
```bash
cd edu-map-mock
cp .env.example .env
# Set ACCOUNT_PRIVATE_KEY in .env
npx hardhat run scripts/deploy.ts --network 0g-testnet
# Copy the printed addresses into tg-backend/.env and op-frontend/app/abi.ts
```

3. Set up the backend:
```bash
cd tg-backend
pip install -r requirements.txt
cp .env.example .env
# Fill in: OG_API_KEY, OG_MODEL, RPC_URL, PRIVATE_KEY, contract addresses
```

4. Set up the frontend:
```bash
cd op-frontend
npm install
# No extra env vars needed — chain config is in app/config.ts
```

### Running the Application

1. Start the backend:
```bash
cd tg-backend
python tele.py
```

2. Start the frontend:
```bash
cd op-frontend
npm run dev
```

## 🌐 0G Network

| | Testnet | Mainnet |
|---|---|---|
| Chain ID | 16602 | 16661 |
| RPC | evmrpc-testnet.0g.ai | evmrpc.0g.ai |
| Explorer | chainscan-galileo.0g.ai | chainscan.0g.ai |
| Compute Router | router-api-testnet.integratenetwork.work/v1 | router-api.0g.ai/v1 |

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines and submit pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please reach out to our team or join our community channels.

## 🌐 Links

- [Website](https://scanio.ai)
- [Twitter](https://twitter.com/ScanioAI)
- [Documentation](https://docs.scanio.ai)
- [0G Docs](https://docs.0g.ai)
- [0G Compute Router](https://pc.0g.ai)
- [0G Faucet](https://faucet.0g.ai)
