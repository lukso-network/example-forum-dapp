import {useContext } from 'react'
import {GlobalContext} from '../../contexts/GlobalContext'

const Comment = ({comment, setPost, postId }) => {

  const {setPosts, account, LSP7Contract} = useContext(GlobalContext)

  const deleteComment = async () => {
    console.log('deleteComment', postId, comment.id, account)
    if(account == comment.commentor){
      try {
        const tx = await LSP7Contract.methods.removeComment(postId, comment.id).send({from: account})
        console.log(tx)
        if(tx.status){

          //remove comment from post
          setPost(prevPost => {
            return {...prevPost, comments: prevPost.comments.filter(comment => comment.id != commentId)}
          }
          )

          //replace post in posts
          setPosts(prevPosts => {
            const newPosts = prevPosts.map(post => {
              if(post.id == postId){
                return {...post, comments: post.comments.filter(comment => comment.id != commentId)}
              }
              return post
            })
            return newPosts
          }
          )
        }
      } catch(err) {
        console.log(err)
      }
    }
  }

  return(
    <div style={{display: 'flex'}}>
      <div>
        {comment.text}
      </div>
      <div style={{marginLeft: 10}} onClick={() => deleteComment()}>
        Delete comment
      </div>
    </div>
  )
}

export default Comment
