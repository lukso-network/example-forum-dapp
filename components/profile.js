import { useEffect, useState } from 'react';
import identicon from 'ethereum-blockies-base64';
import Web3 from 'web3';
import ERC725js from '@erc725/erc725.js';
import LSP3UniversalProfileMetaDataSchema from '@erc725/erc725.js/schemas/LSP3UniversalProfileMetadata.json';
import { IPFS_GATEWAY_BASE_URL } from '../constants';
import _ from 'underscore';

export default function Profile() {
  const [profileInfo, setProfileInfo] = useState({
    address: '',
    name: '',
    description: '',
    picURL: '',
    identiconURL: '',
    isEOA: false,
  });

  const handleProfileInfo = (name, value) => {
    setProfileInfo((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  // On mount
  useEffect(() => {
    loadProfileInformation();
  }, []);

  async function loadProfileInformation() {
    // instanciate Web3
    const web3 = new Web3(window.ethereum);

    // get the accounts from the universal profile extension
    const accounts = await web3.eth.getAccounts();

    // set the first address as the Universal Profile address
    const account = accounts[0];

    // set the address, wether Universal Profile or EOA (MetaMask)
    handleProfileInfo('address', account);

    // generate identicon
    const identiconPicture = identicon(account); // generates a "data:image/png;base64,..."

    handleProfileInfo('identiconURL', identiconPicture);

    const profile = new ERC725js(
      LSP3UniversalProfileMetaDataSchema,
      account,
      web3.currentProvider,
      {
        ipfsGateway: IPFS_GATEWAY_BASE_URL,
      }
    );

    let metaData;
    try {
      metaData = await profile.fetchData('LSP3Profile');
    } catch (error) {
      // IF it fails its likely NO Universal Profile, or a simple EOA (MetaMask)
      console.log('extension is EOA');
      handleProfileInfo('isEOA', true);
      return;
    }

    handleProfileInfo('name', metaData.value.LSP3Profile.name);
    handleProfileInfo('description', metaData.value.LSP3Profile.description);

    // GET the right image size for the profile image from the profile images array
    let profilePicture = _.find(
      metaData.value.LSP3Profile.profileImage,
      (image) => {
        if (image.width >= 200 && image.width <= 500) return image;
      }
    );

    if (!profilePicture) {
      // If there is no image of the preferred size, take the default one
      if (metaData.value.LSP3Profile.profileImage) {
        profilePicture = metaData.value.LSP3Profile.profileImage[0];
      }
    } else {
      profilePicture.url = profilePicture.url.replace(
        'ipfs://',
        IPFS_GATEWAY_BASE_URL
      );
      handleProfileInfo('picURL', profilePicture.url);
    }
  }

  return (
    <div className="center profile">
      <div className="profileImage">
        <div
          className="identicon"
          style={{
            backgroundImage: 'url(' + profileInfo.identiconURL + ')',
          }}
          id="identicon"
        ></div>
        <div
          className="image"
          id="image"
          style={{
            backgroundImage: 'url(' + profileInfo.picURL + ')',
          }}
        ></div>
      </div>
      <span className="username"> {profileInfo.name} </span>
      <p className="addressField">{profileInfo.address}</p>
      <p className="description">{profileInfo.description}</p>
    </div>
  );
}
