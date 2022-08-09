import _ from 'underscore';
import {IPFS_GATEWAY_BASE_URL} from '../constants'

const getProfileUrl = (images) => {
  console.log(images, 'images')
  let profileImage = _.find(images, (image) => {
    if (image.width >= 200 && image.width <= 500) return image;
  });

  if(!profileImage) {
    profileImage = images[0]
  }
  console.log(profileImage, 'profileImage');
  if(profileImage) {
    return profileImage.url.replace('ipfs://', `${IPFS_GATEWAY_BASE_URL}/`)
  } else {
    return ''
  }
}

export default getProfileUrl
