const { deployments, ethers } = require('hardhat');

async function main() {
  const fundMeDeployment = await deployments.get('FundMe');
  const fundMe = await ethers.getContractAt('FundMe', fundMeDeployment.address);

  console.log('Funding contract...');
  const transactionResponse = await fundMe.fund({
    value: ethers.parseEther('0.04'),
  });

  await transactionResponse.wait(1);
  console.log('Funded!');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
