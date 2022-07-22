import React, { useEffect } from 'react';
import Web3 from 'web3';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';

function Dashboard({ href }) {
  const router = useRouter();
  console.log('Dashboard loaded');

  // On mount
  useEffect(() => {
    console.log('Dashboard useEffect loaded');

    test();
  }, []);

  async function test() {
    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    if (accounts.length) {
      console.log('address from ethereum rpc: ', accounts);
      console.log('getCode: ', await web3.eth.getCode(accounts[0]));
    }
  }

  return (
    <div className="App">
      <Notifications />
      <button
        className="nav-link dashboardButton"
        onClick={() => router.push('/create')}
      >
        Create Posts
      </button>
      <button
        className="nav-link dashboardButton"
        onClick={() => router.push('/browse')}
      >
        Browse Posts
      </button>
      <Footer />
    </div>
  );
}

export default Dashboard;
