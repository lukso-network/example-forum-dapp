import { useContext, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';

const LikeBtn = ({ setPost, postId, post }) => {
  const { setPosts, account, LSP7Contract } = useContext(GlobalContext);

  const [likeFailure, setLikeFailure] = useState(false);
  const [likeSuccess, setLikeSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLike, setLike] = useState(false);
  const likePost = async () => {
    setLoading(true);
    try {
      const tx = await LSP7Contract.methods
        .like(postId)
        .send({ from: account });
      if (tx.status) {
        //check if account is already liked remove if it is the case and add if it is not
        setPosts((prevPosts) => {
          const newPosts = prevPosts.map((post) => {
            if (post.id == postId) {
              if (post.likes.includes(account)) {
                return {
                  ...post,
                  likes: post.likes.filter((l) => l != account),
                };
              } else {
                return { ...post, likes: [...post.likes, account] };
              }
            }
            return post;
          });
          return newPosts;
        });

        setPost((prevPost) => {
          if (prevPost.likes.includes(account)) {
            return {
              ...prevPost,
              likes: prevPost.likes.filter((l) => l != account),
            };
          }
          return { ...prevPost, likes: [...prevPost.likes, account] };
        });
      }
      setLoading(false);
      setLikeSuccess(true);
      setLike(!isLike);
      setTimeout(() => {
        setLikeSuccess(false);
      }, 3000);
    } catch (error) {
      setLoading(false);
      setLikeFailure(true);
      setTimeout(() => {
        setLikeFailure(false);
      }, 3000);
    }
  };

  const renderLikeCounter = () => (
    <div style={{ marginLeft: 5 }}>{post.likes.length}</div>
  );

  return (
    <div>
      <div style={{ display: 'flex' }}>
        {isLike ? (
          <button className="postButton" onClick={likePost}>
            Dislike blogpost
          </button>
        ) : null}
        {!isLike ? (
          <button className="postButton" onClick={likePost}>
            Like blogpost
          </button>
        ) : null}
        {post.likes.length ? renderLikeCounter() : null}
      </div>
      {likeFailure ? <p style={{ color: 'red' }}>Like failed</p> : null}
      {likeSuccess ? <p style={{ color: 'green' }}>Like success</p> : null}
      {loading ? <p>Loading...</p> : null}
    </div>
  );
};

export default LikeBtn;
