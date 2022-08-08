import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import identicon from 'ethereum-blockies-base64';

const Comment = ({ comment, setPost, postId }) => {
  const { setPosts, account, LSP7Contract, adminAddress } =
    useContext(GlobalContext);

  const [postComment, setCommentValues] = useState({
    text: '',
    author: '',
    identicon: '',
    name: 'anonymous',
    profilePicture: '',
  });

  const handleCommentValues = (name, value) => {
    setCommentValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  // On mount
  useEffect(() => {
    loadIdenticonPicture();
  }, []);

  async function loadIdenticonPicture() {
    const blockie = identicon('0xFB010D3F1282629a4E9Ef51A355D6AD7B4e2979e');
    handleCommentValues('identicon', blockie);
  }

  const deleteComment = async () => {
    try {
      const tx = await LSP7Contract.methods
        .removeComment(postId, comment.id)
        .send({ from: account });

      if (tx.status) {
        //remove comment from post
        setPost((prevPost) => {
          return {
            ...prevPost,
            comments: prevPost.comments.filter((c) => comment.id != c.id),
          };
        });

        //replace post in posts
        setPosts((prevPosts) => {
          const newPosts = prevPosts.map((post) => {
            if (post.id == postId) {
              return {
                ...post,
                comments: post.comments.filter((c) => comment.id != c.id),
              };
            }
            return post;
          });
          return newPosts;
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="blogComments">
      <div className="commentLeft">
        <div className="commentprofile">
          <div className="profileImage">
            <div
              className="identicon"
              style={{
                backgroundImage: 'url(' + postComment.identicon + ')',
              }}
              id="identicon"
            ></div>
            <div
              className="image"
              id="image"
              style={{
                backgroundImage: 'url(' + postComment.profilePicture + ')',
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="commentRight">
        <b>@{postComment.name}</b>
        <p className="commentText">{comment.text}</p>
        {account == comment.commentor || account == adminAddress ? (
          <button
            className="deleteCommentButton"
            onClick={() => deleteComment()}
          >
            Delete comment
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Comment;
