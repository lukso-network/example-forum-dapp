import {
  addLuksoL14Testnet,
  addLuksoL16Testnet,
} from '../../utils/add-networks';
import { useContext } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import Web3 from 'web3';

function Notifications() {
  const {
    providerError,
    isEOAError,
    browserError,
    chainError,
    setAccount,
    lowBalanceError,
  } = useContext(GlobalContext);

  async function swapNetwork() {
    //get account from metamask
    const { ethereum } = window;
    const web3 = new Web3(ethereum);
    const accounts = await web3.eth.getAccounts();
    (await addLuksoL16Testnet()) && setAccount(accounts[0]);
  }

  ///ERRORS UI///
  const showExtensionError = () => (
    <p id="install" className="warning">
      <>Please install the </>
      <a
        rel="noreferrer"
        href="https://docs.lukso.tech/guides/universal-profile/browser-extension/install-browser-extension"
        target="_blank"
      >
        Universal Profile Browser Extension
      </a>
      <> or </>
      <a rel="noreferrer" href="https://metamask.io/" target="_blank">
        MetaMask
      </a>
      <> to use this dApp.</>
    </p>
  );

  const showBrowserError = () => (
    <p id="browser" className="warning">
      <>Please switch to a </>
      <a rel="noreferrer" href="https://www.google.com/chrome/" target="_blank">
        Chrome
      </a>
      <> or </>
      <a
        rel="noreferrer"
        href="https://www.mozilla.org/firefox/new/"
        target="_blank"
      >
        Firefox
      </a>
      <> browser to use this dApp.</>
    </p>
  );

  const showMulipleExtensionsError = () => (
    <p className="note" id="singular">
      If you have MetaMask AND UP Extension installed, please disable one of
      them! See these guides for{' '}
      <a
        rel="noreferrer"
        href="https://support.google.com/chrome_webstore/answer/2664769?hl=en"
        target="_blank"
      >
        Chrome
      </a>
      <> and </>
      <a
        rel="noreferrer"
        href="https://support.mozilla.org/en-US/kb/disable-or-remove-add-ons#w_disabling-and-removing-extensions"
        target="_blank"
      >
        Firefox
      </a>
      <>.</>
    </p>
  );

  const showWrongChainError = () => (
    <p id="network" className="warning">
      Please change to the{' '}
      <a
        onClick={function () {
          swapNetwork();
        }}
        id="swapnetworkL16"
        style={{ cursor: 'pointer' }}
      >
        LUKSO L16
      </a>
      <> test network to use this dApp.</>
    </p>
  );

  const showMetamaskError = () => (
    <p className="warning" id="extension">
      <>
        You can use MetaMask with this dApp, but we recommend trying it with the
      </>{' '}
      <a
        rel="noreferrer"
        href="https://docs.lukso.tech/guides/browser-extension/install-browser-extension/"
        target="_blank"
      >
        Universal Profile Browser Extension
      </a>
      <> to show author information.</>
    </p>
  );

  const showLowBalanceError = () => (
    <p className="warning" id="lowBalanceL16">
      <>Low account balance. Get funds from </>
      <a
        rel="noreferrer"
        href="https://faucet.l16.lukso.network"
        target="_blank"
      >
        the L16 faucet
      </a>
      <> to send transactions.</>
    </p>
  );

  return (
    <div className="notificationWrapping">
      <div className="notificationContainer">
        {isEOAError ? showMulipleExtensionsError() : null}
        {isEOAError ? showMetamaskError() : null}
        {providerError && !browserError ? showExtensionError() : null}
        {browserError ? showBrowserError() : null}
        {!providerError && chainError ? showWrongChainError() : null}
        {!providerError && isEOAError && lowBalanceError
          ? showLowBalanceError()
          : null}
      </div>
    </div>
  );
}

export default Notifications;
