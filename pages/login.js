import React, { useEffect } from 'react';
import { checkNetwork, connectWeb3 } from '../utils/connect-extension';

function Login() {
  // On mount
  console.log('Login loaded');
  useEffect(() => {
    console.log('login useEffect loaded');
    login();
  });

  async function login() {
    //connectExtension();
    if ((await connectWeb3()) && (await checkNetwork())) {
      router.push('/dashboard');
    }
  }

  // IF the user clicks the LOGIN BUTTON
  async function loginExtension() {
    // Request an account
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    // check if any number of accounts was returned
    // IF go to the dashboard
    if (accounts.length) {
      router.push('/dashboard');
      console.log('navigate refreshed from Login jsx');
    } else console.log();
  }

  return (
    <div className="App">
      <h2>Example Forum dApp</h2>
      <h3>create, comment, and vote on posts and their comments.</h3>

      <br />

      <button onClick={loginExtension}>Log in to your browser extension</button>
    </div>
  );
}

export default Login;
