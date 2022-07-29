import { useRouter } from "next/router"
import {useContext, useEffect, useState} from 'react'
import {GlobalContext} from '../../contexts/GlobalContext'
import Comment from '../../components/post/Comment'
import Link from 'next/link'
import { Footer, Notifications } from '../../components';

const PostPage = () => {

  const router = useRouter()
  const {posts, account, fetchPosts, LSP7Contract, setPosts} = useContext(GlobalContext)
  const [post, setPost] = useState()
  const [loading, setLoading] = useState(false)
  const [newComment, setNewComment] = useState('')

  useEffect(() => {
    const postId = router.query.id
    if(posts.length && postId){
      const post = posts.find(post => post.id == postId)
       loading && setLoading(false)
      if(post){
        setPost(post)
      } else {
        router.push('/browse')
      }
    } else {
      setLoading(true)
      LSP7Contract && fetchPosts()
    }
  },[posts, router])

  const addComment = async (e) => {
    e.preventDefault()
    if(account){
      try {
        const postId = router.query.id
        const tx = await LSP7Contract.methods.createComment(postId, newComment).send({from: account})
        console.log(tx)
        if(tx.status){
          setNewComment('')
          //TODO FETCH COMMENTSCOUNTERS FROM SM in order to give accurate commentId

          //add comment to post
          setPost(prevPost => {
            return {...prevPost, comments: [...prevPost.comments, {
              id: prevPost.comments.length + 1,
              text: newComment,
            }]}
          })

          //replace post in posts
          setPosts(prevPosts => {
            const newPosts = prevPosts.map(post => {
              if(post.id == postId){
                return {...post, comments: [...post.comments, {
                  id: post.comments.length + 1,
                  text: newComment,
                }]}
              }
              return post
            }
            )
            return newPosts
          }
          )

        }
      } catch(err) {
        console.log(err)
      }
    } else {
      alert('Please connect to Universal Profile Extension or Metamaks')
    }
  }



  const renderComments = () => {
    const postId = router.query.id
    return (
      post.comments.map((comment, index) => (
        <Comment key={index} comment={comment} setPost={setPost} postId={postId}/>
      ))
     )
  }

  return (
    <div>
      <Link href={'/browse'}>
        <a className="back">&lt;</a>
      </Link>
      <Notifications />
      {loading?
        <div>Loading...</div>
      :null}
      {post?
        (
          <>
          <div>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
          </div>
          {post.comments.length && renderComments()}
          <form onSubmit={ async (e) => await addComment(e)}>
            <textarea
              value={newComment}
              cols="30"
              rows="10"
              placeholder='Add a comment...'
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type='submit'
            >
              Submit
            </button>
          </form>
          </>
        )
      :null}

      <Footer />
    </div>
  )
}

export default PostPage
