import Likes from './Likes'
import {useState, useContext} from 'react'
import {GlobalContext} from '../../contexts/GlobalContext'
import {useRouter} from 'next/router'

const Post = ({title, text, likes, postId}) => {
  const [newComment, setNewComment] = useState('')
  const {LSP7Contract, account} = useContext(GlobalContext)
  const router = useRouter()

  const addComment = async (e) => {
    e.preventDefault()
    if(account){
      try {
        const tx = await LSP7Contract.methods.createComment(postId, newComment).send({from: account})
        console.log(tx)
        if(tx.status){
          setNewComment('')
        }
      } catch(err) {
        console.log(err)
      }
    } else {
      alert('Please connect to Universal Profile Extension or Metamaks')
    }
  }

  return(
    <div onClick={() => router.push(`/post/${postId}`)}>
      <h5>{title}</h5>
      <p>{text}</p>
      {likes.length ? (
        <Likes likes={likes}/>
        ) : null}
    </div>
  )
}

export default Post
