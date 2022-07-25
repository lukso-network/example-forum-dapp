import { useEffect, useState } from 'react';
import { Footer, Notifications } from '../components';
import Link from 'next/link';
import Profile from '../components/profile';
import { isLuksoNetwork } from '../utils/connect-extension';
import { CHAIN_IDS, IPFS_GATEWAY_BASE_URL } from '../constants';
import { LSPFactory } from '@lukso/lsp-factory.js';
import ERC725js from '@erc725/erc725.js';
import LSP12IssuedAssetsSchema from '@erc725/erc725.js/schemas/LSP12IssuedAssets.json'; // https://docs.lukso.tech/tools/erc725js/schemas
import LSP0ERC725Account from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json';
import Web3 from 'web3';

function CreatePost() {
  const [blogpost, setBlockpostValues] = useState({
    title: '',
    text: '',
    error: '',
    status: '',
    deployEvents: [],
    deploying: false,
  });

  const changeHandler = (e) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  };

  const handleBlogpostProps = (name, value) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  console.log('CreatePost loaded');
  // On mount
  useEffect(() => {
    console.log('CreatePost useEffect loaded');
  }, []);

  async function createBlogpostNFT() {
    const web3 = new Web3(window.ethereum);

    document.getElementById('error').style.display = 'none';
    try {
      const LuksoNetwork = await isLuksoNetwork();
      if (!LuksoNetwork) {
        console.warn('wrong network');
        return;
      }
    } catch (error) {
      console.warn(error);
      handleBlogpostProps('error', error.message);
      document.getElementById('error').style.display = 'block';
      return;
    }

    // GET the address from the browser extension
    const accounts = await web3.eth.getAccounts();
    const account = accounts[0];

    // CONSTRUCT the meta data
    const LSP4MetaData = {
      description: blogpost.text,
      icon: null,
      links: [],
      images: [],
      assets: [],
    };

    // show the deploying status...
    handleBlogpostProps('status', 'blogpost is deploying...');
    handleBlogpostProps('deployEvents', []);
    handleBlogpostProps('deploying', true);

    // DEPLOY the LSP7 token
    // https://docs.lukso.tech/tools/lsp-factoryjs/classes/lsp7-digital-asset

    let contracts;

    // l14 relayer uses smart contracts v0.5.0
    const chainId = await web3.eth.getChainId();
    const version =
      chainId === CHAIN_IDS.L14 ? LSP7Mintable_0_5_0.bytecode : null;

    // INITIATE the LSPFactory
    const factory = new LSPFactory(web3.currentProvider, { chainId });

    try {
      contracts = await factory.LSP7DigitalAsset.deploy(
        {
          name: blogpost.title,
          symbol: 'BLOG',
          controllerAddress: account, // the "issuer" of the asset, that is allowed to change meta data
          creators: [account], // Array of ERC725Account addresses that define the creators of the digital asset.
          isNFT: true, // Token decimals set to 18
          digitalAssetMetadata: LSP4MetaData,
        },
        {
          LSP7DigitalAsset: {
            version,
          },
          ipfsGateway: IPFS_GATEWAY_BASE_URL,
          onDeployEvents: {
            next: (deploymentEvent) => {
              console.log(deploymentEvent);

              if (deploymentEvent.status === 'COMPLETE') {
                handleBlogpostProps(
                  'deployEvents',
                  blogpost.deployEvents.push(deploymentEvent)
                );
              }
            },
            error: (error) => {
              handleBlogpostProps('deploying', false);
              handleBlogpostProps('error', error.message);
              document.getElementById('error').style.display = 'block';
            },
            complete: async (contracts) => {
              console.log('Deployment Complete');
              console.log(contracts.LSP7DigitalAsset);
            },
          },
        }
      );
    } catch (error) {
      console.warn(error.message);
      handleBlogpostProps('error', error.message);
      document.getElementById('error').style.display = 'block';
      handleBlogpostProps('deploying', false);
      return;
    }

    if (!contracts && !contracts.LSP7DigitalAsset) {
      handleBlogpostProps('error', 'Error deploying LSP7DigitalAsset');
      document.getElementById('error').style.display = 'block';
      return;
    }

    const deployedLSP7DigitalAssetContract = contracts.LSP7DigitalAsset;

    // ADD creations to UP
    const options = {
      ipfsGateway: IPFS_GATEWAY_BASE_URL,
    };

    const erc725LSP12IssuedAssets = new ERC725js(
      LSP12IssuedAssetsSchema,
      account,
      window.web3.currentProvider,
      options
    );

    // GET the current issued assets
    let LSP12IssuedAssets;
    try {
      LSP12IssuedAssets = await erc725LSP12IssuedAssets.getData(
        'LSP12IssuedAssets[]'
      );
    } catch (error) {
      console.warn(error.message);
      // Is EOA
      handleBlogpostProps(
        'error',
        'Extension is EOA and can not save blogposts itself'
      );
      document.getElementById('error').style.display = 'block';
    }

    // add new asset
    LSP12IssuedAssets.value.push(deployedLSP7DigitalAssetContract.address);

    // https://docs.lukso.tech/standards/smart-contracts/interface-ids
    const LSP7InterfaceId = '0xe33f65c3';

    const encodedErc725Data = erc725LSP12IssuedAssets.encodeData([
      {
        keyName: 'LSP12IssuedAssets[]',
        value: LSP12IssuedAssets.value,
      },
      {
        keyName: 'LSP12IssuedAssetsMap:<address>',
        dynamicKeyParts: deployedLSP7DigitalAssetContract.address,
        value: [LSP7InterfaceId, LSP12IssuedAssets.length - 1], // LSP7 interface ID + index position of asset
      },
    ]);

    // SEND transaction
    try {
      const profileContract = new window.web3.eth.Contract(
        LSP0ERC725Account.abi,
        account
      );
      const receipt = await profileContract.methods[
        'setData(bytes32[],bytes[])'
      ](encodedErc725Data.keys, encodedErc725Data.values).send({
        from: account,
      });

      handleBlogpostProps(
        'deployEvents',
        blogpost.deployEvents.push({
          receipt,
          type: 'TRANSACTION',
          functionName: 'setData',
        })
      );
    } catch (error) {
      console.warn(error.message);
      handleBlogpostProps('error', error.message);
      handleBlogpostProps('deploying', false);
      return;
    }

    handleBlogpostProps('deploying', false);
    handleBlogpostProps('status', 'blogpost created successfully!');
  }

  return (
    <div className="App">
      <Link href={'/dashboard'}>
        <a className="back">&lt;</a>
      </Link>
      <Notifications />
      <div className="appContainer">
        {' '}
        <h1>Create a post linked to the blockchain</h1>
        <Profile />
        <div className="warning" id="error">
          {blogpost.error}
        </div>
        <label>Title</label>
        <input
          className="titleField"
          placeholder="What are you writing about?"
          id="posttitle"
          type="text"
          value={blogpost.title}
          name="title"
          onChange={changeHandler}
        ></input>
        <br />
        <label>Text</label>
        <textarea
          id="posttext"
          placeholder="Start writing a blogpost..."
          className="textField"
          type="text"
          value={blogpost.text}
          name="text"
          onChange={changeHandler}
        ></textarea>
        <button
          onClick={function () {
            createBlogpostNFT();
          }}
        >
          submit
        </button>
        <div id="status">{blogpost.status}</div>
      </div>

      <Footer />
    </div>
  );
}

export default CreatePost;
