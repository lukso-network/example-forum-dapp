import React, { useEffect } from 'react';
import { checkNetwork, connectWeb3 } from '../utils/connect-extension';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Notifications, Footer } from '../components';

function Login() {
  const router = useRouter();
  // On mount
  console.log('Login loaded');
  useEffect(() => {
    console.log('login useEffect loaded');
    login();
  }, []);

  async function login() {
    if ((await connectWeb3()) && (await checkNetwork())) {
      router.push('/dashboard');
    }
  }

  // IF the user clicks the LOGIN BUTTON
  async function loginExtension() {
    // Request an account
    await window.ethereum
      .request({
        method: 'eth_requestAccounts',
      })
      .then(function (accounts) {
        // check if any number of accounts was returned
        // IF go to the dashboard
        if (accounts.length) {
          router.push('/dashboard');
        } else {
          console.log('User denied access');
        }
      });
  }

  return (
    <div className="App">
      <Notifications></Notifications>
      <h2>Example Forum dApp</h2>
      <h3 className="centered">
        create, comment, and vote on blogposts and their comments.
      </h3>

      <br />

      <button onClick={loginExtension}>Log in to your browser extension</button>
      <Footer />
    </div>
  );
}

export default Login;
