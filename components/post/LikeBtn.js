import {useContext } from 'react'
import {GlobalContext} from '../../contexts/GlobalContext'

const LikeBtn = ({setPost, postId}) => {
  const {setPosts, account, LSP7Contract } = useContext(GlobalContext)
  const likePost = async () => {
    const tx = await LSP7Contract.methods.like(postId).send({from: account})
    if(tx.status){
      //check if account is already liked remove if it is the case and add if it is not
      setPosts(prevPosts => {
        const newPosts = prevPosts.map(post => {
          if(post.id == postId){
            if(post.likes.includes(account)){
              return {...post, likes: post.likes.filter(l => l != account)}
            } else {
              return {...post, likes: [...post.likes, account]}
            }
          }
          return post
        })
        return newPosts
      })

      setPost(prevPost => {
        if(prevPost.likes.includes(account)){
          return {...prevPost, likes: prevPost.likes.filter(l => l != account)}
        }
        return {...prevPost, likes: [...prevPost.likes, account]}
      })
    }
  }

  return (
    <div>
      <p onClick={likePost}>Like</p>
    </div>
  );
}

export default LikeBtn;
