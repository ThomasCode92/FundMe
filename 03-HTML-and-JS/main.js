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
    console.log(ethers);
  }
}

connectBtn.addEventListener('click', connect);
fundBtn.addEventListener('click', fund.bind(this, 0.3));
