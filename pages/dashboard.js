import React, { useEffect } from 'react';
import { checkMinimalBalance, checkNetwork } from '../utils/connect-extension';

function Dashboard() {
  console.log('Dashboard loaded');

  //const web3 = useWeb3();
  //console.log('web3: ', web3);

  // On mount
  useEffect(() => {
    console.log('Dashboard useEffect loaded');

    test();
  }, []);

  async function test() {
    const ethereumtest = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    console.log('address from ethereum rpc: ', ethereumtest);
    //const accounts = await web3.eth.getAccounts(console.log);
    //console.log("address from web3 provider: ", accounts);
    //console.log( "getCode: ", await web3.eth.getCode(ethereumtest[0]));
  }

  return (
    <div className="App">
      <a className="nav-link" href="/create">
        Create Posts
      </a>
      <a className="nav-link" href="/browse">
        Browse Posts
      </a>
    </div>
  );
}

export default Dashboard;
