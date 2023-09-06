const { network } = require('hardhat');

async function deployFunc({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
}

module.exports.default = deployFunc;
