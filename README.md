# Web Ethereum Wallet

A modern Ethereum-only wallet application built with Next.js and ethers.js. This wallet allows you to generate and manage Ethereum wallets securely in your browser. It is specifically designed for the Ethereum blockchain and does not support other chains like Solana, Bitcoin, etc.

## Features

- Generate Ethereum HD wallets using BIP39 mnemonic phrases with Ethereum's derivation path (m/44'/60'/0'/0/*)
- Create single or multiple Ethereum wallets from the same mnemonic
- View and copy Ethereum wallet addresses (0x format) and private keys
- Secure client-side Ethereum wallet generation using ethers.js
- Dark mode interface
- Local storage for persistent wallet management

## Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/web-wallet.git
cd web-wallet
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Generate a new mnemonic phrase
2. Create one or more Ethereum wallets using the mnemonic
3. View and manage your wallets
4. Copy addresses and private keys as needed

## Security Considerations

- This is a client-side Ethereum wallet generator
- All cryptographic operations are performed in your browser using ethers.js
- Never share your mnemonic phrase or private keys
- For significant amounts, consider using hardware wallets
- The wallet data is stored in your browser's local storage

## Technologies

- Next.js
- TypeScript
- ethers.js (Ethereum wallet generation and management)
- Tailwind CSS
- React Hot Toast

## License

This project is licensed under the MIT License.
