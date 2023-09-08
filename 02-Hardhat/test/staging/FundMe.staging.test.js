const { deployments, ethers, network } = require('hardhat');
const assert = require('assert');

const { developmentChains } = require('../../helper-hardhat-config');

describe('FundMe', async function () {
  if (developmentChains.includes(network.name)) {
    throw 'You need to be on a testnet chain to run staging tests';
  }

  let fundMe;

  const ETH_SEND_VALUE = ethers.parseEther('0.04');

  beforeEach(async function () {
    const fundMeDeployment = await deployments.get('FundMe');
    fundMe = await ethers.getContractAt('FundMe', fundMeDeployment.address);
  });

  it('should allow people to fund and withdraw', async function () {
    const provider = fundMe.runner.provider;
    const fundMeAddress = await fundMe.getAddress();

    await fundMe.fund({ value: ETH_SEND_VALUE });
    await fundMe.withdraw();

    const endingBalance = await provider.getBalance(fundMeAddress);

    assert.equal(endingBalance.toString(), '0');
  });
});
