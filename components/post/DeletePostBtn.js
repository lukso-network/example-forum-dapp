import {useContext } from 'react'
import {useRouter} from 'next/router'
import {GlobalContext} from '../../contexts/GlobalContext'


const DeletePostBtn = ({postId}) => {

  const {posts, LSP7Contract, setPosts, account} = useContext(GlobalContext)
  const router = useRouter()

  const deletePost = async () => {
    try {
      const tx = await LSP7Contract.methods.deletePost(postId).send({from: account})
      if(tx.status){
        const newPosts = posts.filter(post => post.id != postId)
        setPosts(newPosts)
        router.push('/browse')
      }
    } catch(er){
      console.log(er)
    }
  }

  return (
    <button
      onClick={() => deletePost()}
      className="btn btn-danger"
    >
      Delete Post
    </button>
  );
}

export default DeletePostBtn;
