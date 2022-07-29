import {useContext } from 'react'
import {GlobalContext} from '../../contexts/GlobalContext'

const Comment = ({comment, setPost, postId }) => {

  const {setPosts, account, LSP7Contract } = useContext(GlobalContext)

  const deleteComment = async () => {
    console.log('delete comment ')
    console.log(comment.id, 'comment.id')
    console.log(postId, 'postId.id')
    if(account == comment.commentor){
      try {
        const tx = await LSP7Contract.methods.removeComment(postId, comment.id).send({from: account})
        console.log(tx)
        if(tx.status){

          //remove comment from post
          setPost(prevPost => {
            return {...prevPost, comments: prevPost.comments.filter(c => comment.id != c.id)}
          }
          )

          //replace post in posts
          setPosts(prevPosts => {
            const newPosts = prevPosts.map(post => {
              if(post.id == postId){
                return {...post, comments: post.comments.filter(c => comment.id != c.id)}
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
