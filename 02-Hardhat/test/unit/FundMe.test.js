const { deployments, ethers, getNamedAccounts, network } = require('hardhat');
const { assert, expect } = require('chai');

const { developmentChains } = require('../../helper-hardhat-config');

describe('FundMe', async function () {
  if (!developmentChains.includes(network.name)) {
    throw 'You need to be on a development chain to run tests';
  }

  let mockV3Aggregator, deployer, fundMe;

  const ETH_SEND_VALUE = ethers.parseEther('1');

  beforeEach(async function () {
    deployer = (await getNamedAccounts()).deployer;

    const deploymentResults = await deployments.fixture(['all']);
    const fundMeAddress = deploymentResults['FundMe'].address;
    const mockV3AggregatorAddress =
      deploymentResults['MockV3Aggregator'].address;

    fundMe = await ethers.getContractAt('FundMe', fundMeAddress);
    mockV3Aggregator = await ethers.getContractAt(
      'MockV3Aggregator',
      mockV3AggregatorAddress,
    );
  });

  describe('constructor', async function () {
    it('should set the aggregator address correctly', async function () {
      const response = await fundMe.getPriceFeed();
      assert.equal(response, mockV3Aggregator.target);
    });
  });

  describe('fund', async function () {
    it('should fail if not enough ETH is send', async function () {
      await expect(fundMe.fund()).to.be.revertedWith("Didn't send enough ETH!");
    });

    it('should update the amount funded data structure', async function () {
      await fundMe.fund({ value: ETH_SEND_VALUE });
      const response = await fundMe.getAddressToAmountFunded(deployer);
      assert.equal(response.toString(), ETH_SEND_VALUE.toString());
    });

    it('should add the funder to array of funders', async function () {
      await fundMe.fund({ value: ETH_SEND_VALUE });
      const response = await fundMe.getFunder(0);
      assert.equal(response, deployer);
    });
  });

  describe('withdraw', async function () {
    beforeEach(async function () {
      await fundMe.fund({ value: ETH_SEND_VALUE });
    });

    it('should withdraw ETH from a single founder', async function () {
      // Arrange
      const fundMeAddress = await fundMe.getAddress();
      const provider = fundMe.runner.provider;

      const startingFundMeBalance = await provider.getBalance(fundMeAddress);
      const startingDeployerBalance = await provider.getBalance(deployer);

      // Act
      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasPrice, gasUsed } = transactionReceipt;
      const totalGasCost = gasUsed * gasPrice;

      const endingFundMeBalance = await provider.getBalance(fundMeAddress);
      const endingDeployerBalance = await provider.getBalance(deployer);

      // Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + totalGasCost).toString(),
      );
    });

    it('should withdraw ETH from multiple funders', async function () {
      // Arrange
      const fundMeAddress = await fundMe.getAddress();
      const accounts = await ethers.getSigners();
      const provider = fundMe.runner.provider;

      for (let i = 0; i < 5; i++) {
        const fundMeConnectedContract = await fundMe.connect(accounts[i]);
        await fundMeConnectedContract.fund({ value: ETH_SEND_VALUE });
      }

      // Act
      const startingFundMeBalance = await provider.getBalance(fundMeAddress);
      const startingDeployerBalance = await provider.getBalance(deployer);

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);

      const { gasPrice, gasUsed } = transactionReceipt;
      const totalGasCost = gasUsed * gasPrice;

      const endingFundMeBalance = await provider.getBalance(fundMeAddress);
      const endingDeployerBalance = await provider.getBalance(deployer);

      // Assert
      assert.equal(endingFundMeBalance, 0);
      assert.equal(
        (startingFundMeBalance + startingDeployerBalance).toString(),
        (endingDeployerBalance + totalGasCost).toString(),
      );

      await expect(fundMe.getFunder(0)).to.be.reverted;

      for (let i = 0; i < 5; i++) {
        const { address } = accounts[i];
        const funderAddress = await fundMe.getAddressToAmountFunded(address);

        assert.equal(funderAddress, 0);
      }
    });

    it('should only allow the owner to withdraw', async function () {
      const accounts = await ethers.getSigners();
      const attacker = accounts[1];

      const attackerConnectedContract = await fundMe.connect(attacker);

      await expect(
        attackerConnectedContract.withdraw(),
      ).to.be.revertedWithCustomError(fundMe, 'FundMe__NotOwner');
    });
  });
});
