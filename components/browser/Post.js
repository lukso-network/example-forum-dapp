import {useState, useContext} from 'react'
import {GlobalContext} from '../../contexts/GlobalContext'
import {useRouter} from 'next/router'

const Post = ({title, text, likes, postId}) => {
  const [newComment, setNewComment] = useState('')
  const {LSP7Contract, account} = useContext(GlobalContext)
  const router = useRouter()

  return(
    <div onClick={() => router.push(`/post/${postId}`)}>
      <h5>{title}</h5>
      <p>{text}</p>
    </div>
  )
}

export default Post
