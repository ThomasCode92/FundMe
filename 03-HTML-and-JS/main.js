const connectBtn = document.getElementById('connect-btn');

async function connect() {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    connectBtn.innerText = 'Connected';
    console.log('Connected to MetaMask');
  } else {
    console.log('Please install MetaMask');
  }
}

connectBtn.addEventListener('click', connect);
