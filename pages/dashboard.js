import React, { useEffect } from 'react';
import Web3 from 'web3';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';
import Link from 'next/link';

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
    const ethereumtest = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('address from ethereum rpc: ', ethereumtest);
    console.log('getCode: ', await web3.eth.getCode(ethereumtest[0]));
  }

  return (
    <div className="App">
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.2.3/milligram.min.css"
        ></link>
        <meta charset="UTF-8"></meta>
      </Head>
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
