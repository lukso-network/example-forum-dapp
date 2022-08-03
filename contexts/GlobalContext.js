import {createContext, useState, useEffect} from 'react'
import Web3 from 'web3'
import LSP7Artifact from '../utils/forum-lsp7-artifact.json'
import {IPFS_GATEWAY_BASE_URL, LSP7Address} from '../constants'
import { useRouter } from 'next/router'
import {checkBrowserCompatibility, checkMinimalBalance, isEOA, isL16} from '../utils/connect-extension'

export const GlobalContext = createContext()

const GlobalProvider = ({children}) => {
  const [posts, setPosts] = useState([])
  const [account, setAccount] = useState('')
  const [LSP7Contract, setLSP7Contract] = useState()
  const [tokenIdCounter, setTokenIdCounter] = useState()
  const [commentIdCounter, setCommentIdCounter] = useState()
  const [adminAddress, setAdminAddress] = useState()

  //ERRORS
  const [providerError, setProviderError] = useState(false)
  const [isEOAError, setIsEOAError] = useState(false)
  const [browserError, setBrowserError] = useState(false)
  const [chainError, setChainError] = useState(false)
  const [lowBalanceError, setLowBalanceError] = useState(false)

  const router = useRouter()

  const cidFetcher = async (cid) => {
    try {
      const res = await fetch(`${IPFS_GATEWAY_BASE_URL}/${cid}`)
      const cidObj = await res.json()
      return cidObj
    } catch(er) {
      console.log(er)
      return
    }
  }



  const fetchPosts = async () => {

    try {
      let {0: postsList, 1: tokenCounter, 2: commentCounter, 3: admin }= await LSP7Contract.methods.fetchPosts().call()

      let formattedPostsList = []
      await Promise.all(
       await postsList.map(async post => {
         const {title, text} = await cidFetcher(post.cid)
         let comments = []
         if(post.comments) {
            // fetching comments cids and transforming them to objects
            await Promise.all(
              post.comments.map(async comment => {
                const {text} = await cidFetcher(comment.cid)
                if(text){
                  const commentObj = {...comment, text}
                  comments.push(commentObj)
                }
              }
            ))
         }
         const postObj =  {title, text,...post, comments }
         text && title && formattedPostsList.push(postObj)
        })
      )
      setPosts(formattedPostsList)
      setTokenIdCounter(parseInt(tokenCounter))
      setCommentIdCounter(parseInt(commentCounter))
      setAdminAddress(admin)
    } catch(er){
      console.log(er, LSP7Contract)
    }
  }

  const getAccount = async (web3) => {
    await web3.eth.getAccounts().then(accounts => {
      setAccount(accounts[0])
    })
  }

  const listenForAccountChanges = () => {
    ethereum.on('accountsChanged', function (accounts) {
      if(accounts.length) {
        setAccount(accounts[0])
      } else {
        setAccount()
        router.push('/login')
      }
    })

    ethereum.on('networkChanged', function (networkId) {
      if(networkId !== 2828) {
        setChainError(true)
      } else {
        setChainError(false)
      }
    })

  }

  const  ErrorsCheck = async () => {
    await checkBrowserCompatibility() ? setBrowserError(false): setBrowserError(true)
    account && await isEOA()? setIsEOAError(true): setIsEOAError(false)
    await isL16()? setChainError(false): setChainError(true)
    account && await checkMinimalBalance()? setLowBalanceError(true): setLowBalanceError(true)
  }

  useEffect(() => {
    ErrorsCheck()

    const {ethereum} = window
    if(ethereum) {
      setProviderError(false)
      listenForAccountChanges()
      const web3 = new Web3(ethereum)
      setLSP7Contract(new web3.eth.Contract(LSP7Artifact.abi,LSP7Address))
      getAccount(web3)
    } else {
      setProviderError(true)
      router.push('/login')
    }
  }, [account])

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
      tokenIdCounter, fetchPosts, commentIdCounter, setCommentIdCounter,
      adminAddress, setAccount,
      providerError, isEOAError, browserError, chainError, lowBalanceError
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
