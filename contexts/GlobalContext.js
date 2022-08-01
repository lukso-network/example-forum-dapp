import {createContext, useState, useEffect} from 'react'
import Web3 from 'web3'
import LSP7Artifact from '../utils/forum-lsp7-artifact.json'
import LSP7Address from '../utils/LSP7-address';

export const GlobalContext = createContext()

const GlobalProvider = ({children}) => {
  const [posts, setPosts] = useState([])
  const [account, setAccount] = useState('')
  const [LSP7Contract, setLSP7Contract] = useState()
  const [tokenIdCounter, setTokenIdCounter] = useState()
  const [commentIdCounter, setCommentIdCounter] = useState()

  const fetchPosts = async () => {
    try {
      const {0: postsList, 1: tokenCounter, 2: commentCounter }= await LSP7Contract.methods.fetchPosts().call()
      setPosts(postsList)
      setTokenIdCounter(parseInt(tokenCounter))
      setCommentIdCounter(parseInt(commentCounter))
    } catch(er){
      console.log(er, LSP7Contract)
    }
  }

  const getAccount = async (web3) => {
    await web3.eth.getAccounts().then(accounts => {
      setAccount(accounts[0])
    })
  }

  useEffect(() => {
    const {ethereum} = window
    if(!ethereum){
      alert('Please install Universal Profile Extension or MetaMask')
    }
    const web3 = new Web3(ethereum)

    setLSP7Contract(new web3.eth.Contract(LSP7Artifact.abi,LSP7Address))
    getAccount(web3)

  }, [])

  useEffect(() => {
    if(LSP7Contract){
      try {
        fetchPosts()
      } catch (error) {
        console.log('could not fetch posts')
      }
    }
  }, [LSP7Contract])

  return (
    <GlobalContext.Provider value={{
      posts, setPosts, account, LSP7Contract, setTokenIdCounter,
      tokenIdCounter, fetchPosts, commentIdCounter, setCommentIdCounter
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
