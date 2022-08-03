import Web3 from 'web3';
import { CHAIN_IDS } from '../constants';

export async function checkBrowserCompatibility() {
  // Check if Browser is Chrome or Firefox
  if (
    !(window.navigator.userAgent.indexOf('Firefox') !== -1 ||
    window.navigator.userAgent.indexOf('Chrome') !== -1)
  ) {
    return false;
  }
    return true
}

export const hasEthereumProvider = () => {
  return !!window.ethereum;
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
    return false
  }
  return true
}

export async function isEOA() {
  // Access web3
  const web3 = new Web3(window.ethereum);

  // Get account
  let accounts = await web3.eth.getAccounts();

  // Check if account is an EOA
  return await web3.eth.getCode(accounts[0]) === '0x';
}


export async function isL16() {
  try {
    const web3 = new Web3(window.ethereum);
    let chainId = await web3.eth.getChainId();
    if (chainId == CHAIN_IDS.L16) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  }
}
