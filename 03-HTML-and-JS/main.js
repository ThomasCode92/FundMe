import abi from './abi.json' assert { type: 'json' };

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const connectBtnElement = document.getElementById('connect-btn');
const fundBtnElement = document.getElementById('fund-btn');
const balanceBtnElement = document.getElementById('balance-btn');
const withdrawBtnElement = document.getElementById('withdraw-btn');
const fundInputElement = document.getElementById('fund');

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    connectBtnElement.innerText = 'Connected';
    console.log('Connected to MetaMask');
  } else {
    console.log('Please install MetaMask');
  }
}

async function fund() {
  const ethAmount = fundInputElement.value;
  console.log(`Funding with ${ethAmount}ETH...`);

  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      await listenForTransactionMine(transactionResponse, provider);
      console.log('Done!');
    } catch (error) {
      console.error(error);
    }
  }
}

async function withdraw() {
  console.log('Withdrawing...');
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);

    try {
      const transactionResponse = await contract.withdraw();

      await listenForTransactionMine(transactionResponse, provider);
      console.log('Done!');
    } catch (error) {
      console.error(error);
    }
  }
}

async function getBalance() {
  if (typeof window.ethereum !== 'undefined') {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(CONTRACT_ADDRESS);

    console.log(ethers.utils.formatEther(balance));
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, transactionReceipt => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );

      resolve();
    });
  });
}

connectBtnElement.addEventListener('click', connect);
fundBtnElement.addEventListener('click', fund);
withdrawBtnElement.addEventListener('click', withdraw);
balanceBtnElement.addEventListener('click', getBalance);
