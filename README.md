# Stellar Level 2 - Yellow Belt Submission: Soroban Live Poll

This project implements a Live Poll decentralized application (dApp) on the Stellar Testnet, built with React, Vite, and Soroban smart contracts. It successfully integrates `StellarWalletsKit` to interact with multiple wallets (Freighter, xBull), processes transactions on the Stellar network, and synchronizes real-time contract state.

## 📝 Features
- **Multi-Wallet Integration**: Connects to both Freighter and xBull using `@creit.tech/stellar-wallets-kit`.
- **Smart Contract Deployment**: Custom Soroban Rust smart contract deployed on the Stellar testnet.
- **Contract Interaction**: Read (`get_votes`) and Write (`vote`) methods invoked from the frontend using the new Soroban RPC SDK.
- **Robust Error Handling**: Handles edge cases like "Wallet Not Found", "User Rejected Request", and "Insufficient Balance".
- **Real-time Event Synchronization**: Periodically polls the smart contract state to update vote counts seamlessly.

## 🛠 Prerequisites
- Node.js (v18+)
- Basic understanding of Stellar & Soroban testnet.
- [Freighter](https://www.freighter.app/) or [xBull](https://xbull.app/) browser extension installed.

## 🚀 Setup Instructions
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).
5. Ensure your Stellar wallet extension is active, set to the **Testnet**, and funded with at least 2 XLM to cover connection reserves.

## 🏁 Submission Deliverables
- **Live Demo Link:** *(Optional: Deploy to Vercel/Netlify and add link here)*
- **Screenshot:** *(Optional: Add a screenshot of the multi-wallet selection UI here)*
- **Deployed Contract Address:** `CDRZCJDK7G5U4PBKLTPQL4ENKLPHHJJ4A75G6OFPKBPFPHIDRP73GDUC`
- **Transaction Hash of a Contract Call (Deploy & Initial Interaction):** `d782d0b30c28ca6bc962c2dd37047cbd94d012f43bd1be4b2275393a1fb5a433`

> View Transaction on [Stellar Expert Explorer](https://stellar.expert/explorer/testnet/tx/d782d0b30c28ca6bc962c2dd37047cbd94d012f43bd1be4b2275393a1fb5a433)

Enjoy the Live Poll dApp!
