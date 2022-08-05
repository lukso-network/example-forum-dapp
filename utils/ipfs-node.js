import {IPFS_BASE_URL} from '../constants'
import {create} from 'ipfs-http-client'

const ipfsNode = () => {
  return create({url: IPFS_BASE_URL})
}

export default ipfsNode
