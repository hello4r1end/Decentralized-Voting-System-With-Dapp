# Decentralized Voting System with DApp

This project is a decentralized voting system built using blockchain technology. It allows users to vote securely and transparently using a smart contract deployed on the Ethereum blockchain. The system ensures that votes are immutable and verifiable by leveraging the security features of blockchain technology.

# Table of Contents
# Introduction
# Features
# Technologies Used
# Setup and Installation
# Usage
# Smart Contract
# imitations and Future Work


# Introduction

The decentralized voting system aims to provide a secure and transparent platform for conducting elections. By using blockchain technology, the system ensures that votes are tamper-proof and can be independently verified.

Features
Secure and transparent voting system
Immutable vote records
Easy-to-use decentralized application (DApp)
Real-time vote counting and result display
Admin panel for managing candidates and resetting elections
Technologies Used
Backend
Ethereum Blockchain: For deploying and managing the smart contract.
Solidity: Programming language for writing the smart contract.
Hardhat: Ethereum development environment for deploying and testing smart contracts.
Frontend
React: Library for building the user interface.
Ethers.js: Library for interacting with the Ethereum blockchain.
Material-UI: Library for building responsive and customizable user interface components.
Setup and Installation
Prerequisites
Node.js (v12 or later)
npm or yarn
MetaMask browser extension
Installation Steps
Clone the repository:
```bash
git clone https://github.com/hello4r1end/Decentralized-Voting-System-With-Dapp-.git
cd Decentralized-Voting-System-With-Dapp-
```
# Install dependencies:
```bash
npm install
```

# Update contract and admin address:

Open src/App.js in your code editor.

Replace the contractAddress with your own deployed contract address.

Replace the adminAddress with your own wallet address to be the admin.
```bash
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const adminAddress = 'YOUR_WALLET_ADDRESS';
```
Admin Panel.
![image](https://github.com/hello4r1end/Decentralized-Voting-System-With-Dapp-/assets/60706453/b709bd56-a356-4af2-b9b7-50872f7a509b)


User Panel.

![image](https://github.com/hello4r1end/Decentralized-Voting-System-With-Dapp-/assets/60706453/50d92e45-b4cf-4160-82a7-c7099d0a8c1d)



Start the development server:
```bash
npm start
```
Open the DApp in your browser:
```bash
http://localhost:3000
```
# Usage
Connect MetaMask:

Open the DApp in your browser.
Connect your MetaMask wallet.
Admin Panel:

Add new candidates.
Reset elections when needed.
Voting:

Select a candidate and cast your vote.
View real-time voting results.
# Smart Contract
The smart contract is written in Solidity and handles the core logic of the voting system. It includes functionalities such as:

Adding candidates

Voting for a candidate

Resetting the election

Counting votes

Key Smart Contract Methods

~addCandidates(string[] memory candidateNames): Allows the admin to add new candidates.

~vote(uint index): Allows a user to vote for a candidate by index.

~endElection(): Allows the admin to end the election and determine the winner.

~resetElection(uint _votingDuration): Resets the election for a new voting period.

# Limitations and Future Work
Current Limitations
The system is not fully anonymous; vote logs can be linked to user addresses.
The smart contract execution costs may vary based on network congestion and gas prices.
Future Work
Implement zk-SNARKs for enhanced voter anonymity.
Improve the user interface and user experience.
Add multi-language support.
