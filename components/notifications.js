function Notifications() {
  return (
    <div>
      <p className="note" id="singular" style={{ display: 'block' }}>
        If you have MetaMask AND Universal Profile Browser Extension installed,
        please disable one of them! See these guides for
        <a
          rel="noreferrer"
          href="https://support.google.com/chrome_webstore/answer/2664769?hl=en"
          target="_blank"
        >
          {' '}
          Chrome
        </a>{' '}
        and
        <a
          rel="noreferrer"
          href="https://support.mozilla.org/en-US/kb/disable-or-remove-add-ons#w_disabling-and-removing-extensions"
          target="_blank"
        >
          {' '}
          Firefox
        </a>
        .
      </p>
      <p className="warning" id="extension">
        You can use MetaMask with this dApp, but we recommend trying it with the{' '}
        <a href="https://docs.lukso.tech/guides/universal-profile/browser-extension/install-browser-extension">
          Universal Profile Browser Extension
        </a>
        .
      </p>
      <p className="warning" id="lowBalanceL14">
        Low account balance. Get funds from{' '}
        <a
          rel="noreferrer"
          href="http://faucet.l14.lukso.network/"
          target="_blank"
        >
          the L14 faucet{' '}
        </a>
        to send transactions.
      </p>
      <p className="warning" id="lowBalanceL16">
        Low account balance. Get funds from{' '}
        <a
          rel="noreferrer"
          href="https://faucet.l16.lukso.network"
          target="_blank"
        >
          the L16 faucet{' '}
        </a>
        to send transactions.
      </p>
      <p id="browser" className="warning">
        Please switch to a
        <a
          rel="noreferrer"
          href="https://www.google.com/chrome/"
          target="_blank"
        >
          {' '}
          Chrome
        </a>{' '}
        or
        <a
          rel="noreferrer"
          href="https://www.mozilla.org/firefox/new/"
          target="_blank"
        >
          {' '}
          Firefox
        </a>{' '}
        browser to use this dApp.
      </p>
      <p id="network" className="warning">
        Please change to the
        <a id="swapnetworkL14" style={{ cursor: 'pointer' }}>
          {' '}
          LUKSO L14
        </a>{' '}
        or
        <a id="swapnetworkL16" style={{ cursor: 'pointer' }}>
          LUKSO L16
        </a>{' '}
        test network to use this dApp.
      </p>
      <p id="install" className="warning">
        Please install the
        <a
          rel="noreferrer"
          href="https://docs.lukso.tech/guides/universal-profile/browser-extension/install-browser-extension"
          target="_blank"
        >
          {' '}
          Universal Profile Browser Extension
        </a>{' '}
        or
        <a rel="noreferrer" href="https://metamask.io/" target="_blank">
          {' '}
          MetaMask
        </a>{' '}
        to use this dApp.
      </p>
      <div id="login" style={{ display: 'none' }}>
        <button id="loginbutton">Log in to your browser extension</button>
      </div>
    </div>
  );
}

export default Notifications;
