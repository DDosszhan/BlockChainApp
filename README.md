# DAppMarketPlace

A decentralized application (dApp) for an AI Model Marketplace. This project allows users to list, purchase, and rate AI models, leveraging blockchain technology through smart contracts.

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Setup](#setup)
- [Running the dApp](#running-the-dapp)
- [Usage](#usage)
- [Contributing](#contributing)

## Introduction

This dApp enables a decentralized marketplace for trading AI models. Users can:
- List AI models for sale.
- Purchase models securely on the blockchain.
- Rate and review models.

The marketplace operates on Ethereum smart contracts using Truffle for deployment and Web3.js for blockchain interactions.

## Features
- **Decentralized Listing**: List models without intermediaries.
- **Blockchain-Powered Transactions**: Purchase models using cryptocurrency.
- **Model Rating System**: Users can rate AI models they purchase.

## Requirements

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.x or later)
- [Truffle](https://www.trufflesuite.com/) (v5.x or later)
- [Ganache](https://www.trufflesuite.com/ganache) (local Ethereum blockchain)
- [MetaMask](https://metamask.io/) (browser extension for interacting with Ethereum blockchain)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/DDosszhan/DAppMarketPlace
cd DAppMarketPlace
```


### 2. Install Dependencies
```bash
npm install truffle web3 http-server
```
This will install:

- Truffle: For compiling, deploying, and testing smart contracts.
- Web3.js: JavaScript library for interacting with the Ethereum blockchain.
- http-server: Simple server to run your dApp locally.

### 3. Install Ganache (Local Blockchain)

#### Download and install [Ganache](https://www.trufflesuite.com/ganache) to create a local Ethereum blockchain for testing purposes.

## Setup


### 4. Start Ganache
- Open Ganache and create a new workspace or quickstart.
- Copy the RPC Server URL (usually http://127.0.0.1:7545) and paste it in your truffle-config.js under the development network settings.
```bash
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",  // Localhost (default: none)
      port: 7545,         // Standard Ethereum port (default: none)
      network_id: "*"     // Any network (default: none)
    }
  },
  ...
};
```

### 5. Compile and Migrate Smart Contracts
In the terminal, run:
```bash
truffle compile
truffle migrate
```
This will:

- Compile the Solidity smart contracts.
- Deploy them to your local Ganache blockchain.

### 6. Update Frontend with Contract Address
After deploying the contract, you will see the contract address in the console.

- Copy the contract address.
- Open app.js in the project directory.
- Paste the contract address where indicated:
```bash
const contractAddress = 'PASTE_CONTRACT_ADDRESS_HERE';
```

## Running the dApp

To run the dApp locally, follow these steps:

1. Start a local server:
```bash
http-server
```
2. Open your browser and navigate to the provided URL (usually http://localhost:8080).

3. Connect MetaMask to the local Ganache network:
   - Open MetaMask.
   - Add a custom RPC network using Ganache's RPC URL (e.g., http://127.0.0.1:7545).
  
## Usage

Once the dApp is running, you can perform the following actions:
1. List AI Models: Add your models to the marketplace by providing the required details.
2. Purchase Models: Use the dApp interface to purchase models securely.
3. Rate Models: After purchasing, leave a rating to provide feedback for others.

## Contributing
Contributions are welcome! To contribute:
1. Fork this repository.
2. Create a new branch (git checkout -b feature-branch).
3. Commit your changes (git commit -m 'Add feature').
4. Push the branch (git push origin feature-branch).
5. Open a Pull Request.
