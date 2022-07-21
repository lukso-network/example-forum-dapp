import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home({ UpAddress }) {
  const router = useRouter();

  // On mount
  useEffect(() => {
    console.log('App useEffect loaded');
    checkForExtension();
  }, []);

  async function checkForExtension() {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });

      // If no account was found
      if (!accounts.length) {
        console.log('user is not logged in');
        router.push('/login');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return <div className="App"></div>;
}

export async function getStaticProps() {
  // code goes here
  return {
    props: {
      UpAddress: '',
    },
  };
}
