# FundMe - Hardhat

This version of the FundMe project is built with [hardhat](https://hardhat.org/).<br />

## Hardhat

Hardhat is a development environment and task runner for Ethereum _Smart Contract_ and _Decentralized Application_ (DApp) development. It is designed to streamline the Ethereum development process by providing a powerful and extensible set of tools for developers. Here are some key features and aspects of the Hardhat framework:

- **Smart Contract Development**<br />Developers can write their smart contracts in Solidity, the most commonly used programming language for Ethereum, and use Hardhat to compile and manage them.
- **Testing**<br />Built-in support for testing smart contracts (using popular testing frameworks like Mocha and Chai).
- **Scriptable Tasks**<br />Define custom tasks and scripts to automate various development and deployment processes.
- **Plugin System**<br />Plugin system to extend functionalities easily.
- **Built-in Network Management**<br />Support for Ethereum networks out of the box, including local development networks and integration with public Ethereum networks.

## How to use

This project is intended to work seamlessly within [VS Code](https://code.visualstudio.com/) and involves deploying a Smart Contract on a (locally running) testnet.<br />Make sure to create a _.env file_ within the project directory. This file will be used to define the following values:

- `PRIVATE_KEY`: MetaMask Private Key
- `SEPOLIA_RPC_URL`: RPC URL to the Sepolia Testnet
- `ETHERSCAN_API_KEY`: API Key of an Etherscan account

To deploy and test the _FundMe.sol_ Smart Contract, use one of the following commands:

```bash
  yarn hardhat deploy
  yarn hardhat test
    # for the sepolia testnet, use the following:
  yarn hardhat deploy --network sepolia
  yarn hardhat test --network sepolia
```
