import React, { useEffect } from 'react';
import Link from 'next/link';
import { checkMinimalBalance, checkNetwork } from '../utils/connect-extension';
import Web3 from 'web3';

function Dashboard() {
  console.log('Dashboard loaded');

  // On mount
  useEffect(() => {
    console.log('Dashboard useEffect loaded');

    test();
  }, []);

  async function test() {
    const web3 = new Web3(window.ethereum);
    const ethereumtest = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('address from ethereum rpc: ', ethereumtest);
    console.log('getCode: ', await web3.eth.getCode(ethereumtest[0]));
  }

  return (
    <div className="App">
      <Link className="nav-link" href="/create">
        Create Posts
      </Link>
      <Link className="nav-link" href="/browse">
        Browse Posts
      </Link>
    </div>
  );
}

export default Dashboard;
