import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';
import Link from 'next/link';
import identicon from 'ethereum-blockies-base64';
import Web3 from 'web3';

export default function Profile() {
  const [profileAddress, setProfileAddress] = useState(null);

  const handleProfile = (address) => {
    setProfileAddress(address);
  };

  // On mount
  useEffect(() => {
    loadProfileInformation();
  }, []);

  async function loadProfileInformation() {
    const web3 = new Web3(window.ethereum);

    // GET the UNIVERSAL PROFILE DATA
    const accounts = await web3.eth.getAccounts();

    // TODO: make sure accounts is not empty!
    const account = accounts[0]; // set the first address as the Universal Profile address
    handleProfile(account);
    console.log('address', profileAddress);
    // set the address, wether Universal Profile or EOA (MetaMask)

    // generate identicon
    const identiconPicture = identicon(account); // generates a "data:image/png;base64,..."
    const prepImage = 'url(' + identiconPicture + ')';
    document.getElementById('identicon').style.backgroundImage = prepImage;
    /*
        // INSTANTIATE erc725.js
        // window.web3 was set in App.vue
        const profile = new ERC725js(LSP3UniversalProfileMetaDataSchema, account, window.web3.currentProvider, {
        ipfsGateway: IPFS_GATEWAY_BASE_URL, // todo the gateway should be without /ipfs/
        });
        
        let metaData;
        try {
        metaData = await profile.fetchData('LSP3Profile');
        } catch (e) {
        // IF it fails its likely NO Universal Profile, or a simple EOA (MetaMask)

        this.profileData.name = false;
        return;
        }

        this.profileData = {
        // merge profileData with fetched profile data
        ...this.profileData,
        ...metaData.value.LSP3Profile,
        };

        // GET the right image size for the profile image from the profile images array
        this.profileData.profileImage = _.find(this.profileData.profileImage, (image) => {
        if (image.width >= 200 && image.width <= 500) return image;
        });

        // If there is no image of the preferred size, take the default one
        if (!this.profileData.profileImage && metaData.value.LSP3Profile.profileImage) {
        this.profileData.profileImage = metaData.value.LSP3Profile.profileImage[0];
        // change the IPFS path to a provider of our choice
        }
        this.profileData.profileImage.url = this.profileData.profileImage.url.replace('ipfs://', profile.options.ipfsGateway);
        */
  }

  return (
    <div className="center profile">
      <div className="profileImage">
        <div className="identicon" id="identicon"></div>
        <div className="image"></div>
      </div>
      <span className="username"> {'username'} </span>
      <p className="addressField">{profileAddress}</p>
      <p className="description">{'description'}</p>
    </div>
  );
}
