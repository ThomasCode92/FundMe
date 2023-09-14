import abi from './abi.json' assert { type: 'json' };

const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

const connectBtn = document.getElementById('connect-btn');
const fundBtn = document.getElementById('fund-btn');

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    connectBtn.innerText = 'Connected';
    console.log('Connected to MetaMask');
  } else {
    console.log('Please install MetaMask');
  }
}

async function fund(ethAmount) {
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

connectBtn.addEventListener('click', connect);
fundBtn.addEventListener('click', fund.bind(this, '0.3'));
