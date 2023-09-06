const { run } = require('hardhat');

async function verify(contractAddress, args) {
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (error) {
    if (error.message.toLowerCase().includes('already verified')) {
      return console.log('Already Verified');
    }

    console.error(error);
  }
}

module.exports = { verify };
