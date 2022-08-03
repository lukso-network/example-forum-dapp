
import { addLuksoL14Testnet, addLuksoL16Testnet } from '../../utils/add-networks';
import { useContext } from 'react';
import {GlobalContext} from '../../contexts/GlobalContext';

function Notifications() {

  const { providerError, isEOAError, browserError, chainError } = useContext(GlobalContext);


  ///ERRORS UI///
  const showExtensionError = () => (
    <p id="install" className="warning" style={{ display: 'block' }}>
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
  )

  const showBrowserError = () => (
    <p id="browser" className="warning" style={{ display: 'block' }}>
      <>Please switch to a </>
      <a
        rel="noreferrer"
        href="https://www.google.com/chrome/"
        target="_blank"
      >
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
  )

  const showMulipleExtensionsError = () => (
    <p className="note" id="singular" style={{ display: 'block' }}>
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
  )

  const showWrongChainError = () => (
    <p id="network" className="warning" style={{ display: 'block' }}>
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
  )

  const showMetamaskError = () => (
    <p className="warning" id="extension" style={{ display: 'block' }}>
      <>
        You can use MetaMask with this dApp, but we recommend trying it with
        the
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
  )

  const showLowBalanceError = () => (
    <p className="warning" id="lowBalanceL16" style={{ display: 'block' }}>
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
  )

  return (
    <div className="notificationContainer">
      {isEOAError? showMulipleExtensionsError() : null}
      {isEOAError? showMetamaskError() : null}
      {providerError ? showExtensionError() : null}
      {browserError ? showBrowserError():null}
      {!providerError && chainError? showWrongChainError() : null}
      {/* {!providerError && lowBalanceError? showLowBalanceError() : null} */}
    </div>
  );
}

async function swapNetwork( ) {
  await addLuksoL16Testnet();
}

export default Notifications;
