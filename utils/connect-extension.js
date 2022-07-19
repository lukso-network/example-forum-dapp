import Web3 from 'web3';

export async function connectWeb3() {
  // Check if Browser is Chrome or Firefox
  if (
    navigator.userAgent.indexOf('Firefox') !== -1 ||
    navigator.userAgent.indexOf('Chrome') !== -1
  ) {
    // Check if browser extension is installed

    // Get account
    if (window.ethereum) {
      // Access web3
      const web3 = new Web3(window.ethereum);
      // Request account
      let account = await web3.eth.getAccounts();

      // If no account was found
      if (!account.length) {
        return false;
      } else {
        return true;
      }
    }

    // Provider not set or invalid
    else {
      // Show install extension notification
      document.getElementById('install').style.display = 'block';
      document.getElementById('singular').style.display = 'none';
      return false;
    }
  }

  // Browser is not supported
  else {
    // Show unsupported browser notification
    document.getElementById('browser').style.display = 'block';
    document.getElementById('singular').style.display = 'none';
    return false;
  }
}

export async function checkMinimalBalance() {
  // Access web3
  const web3 = new Web3(window.ethereum);

  // Get account
  let accounts = await web3.eth.getAccounts();

  // Get the account balance and check if it is above 0.25 LYXt
  if (
    web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') < 0.25
  ) {
    // Show low balance browser notification
    let chainID = await web3.eth.getChainId();
    if (chainID === 22) {
      document.getElementById('lowBalanceL14').style.display = 'block';
    } else if (chainID === 2828) {
      document.getElementById('lowBalanceL16').style.display = 'block';
    }
  }
}

export async function checkNetwork() {
  try {
    // Access web3
    const web3 = new Web3(window.ethereum);

    // Get account
    let account = await web3.eth.getAccounts();

    // Get the bytecode of the address or smart contract
    let bytecode = await web3.eth.getCode(account[0]);

    // If address is EOA, likely a 3rd party extension is used
    if (bytecode === '0x') {
      // Show 3rd party extension notification
      document.getElementById('extension').style.display = 'block';

      // Get its network ID
      const networkID = await web3.eth.net.getId();
      // Check if its connected to the wrong network
      if (networkID !== 22 && networkID !== 2828) {
        // Show wrong network notification
        document.getElementById('network').style.display = 'block';
        return false;
      }

      /**
       * 3rd party extension is connected to the right network.
       * Check if balance on network is enough to send transactions
       */
      await checkMinimalBalance();
      return true;
    }

    // Likely installed the UP extension
    return true;
  } catch (error) {
    console.log('checkNetwork failed:', error);
    /**
     *  Extension not installed or locked:
     *  connectWeb3() needs to be run before
     */
    return false;
  }
}
