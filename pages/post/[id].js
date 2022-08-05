import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import Comment from '../../components/post/Comment';
import Link from 'next/link';
import LikeBtn from '../../components/post/LikeBtn';
import ipfsNode from '../../utils/ipfs-node';
import DeletePostBtn from '../../components/post/DeletePostBtn';
import Loader from '../../components/shared/loader';

const PostPage = () => {
  const router = useRouter();
  const {
    posts,
    account,
    fetchPosts,
    LSP7Contract,
    setPosts,
    commentIdCounter,
    setCommentIdCounter,
    adminAddress,
  } = useContext(GlobalContext);
  const [post, setPost] = useState();
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [onIpfs, setOnIpfs] = useState(false);
  const [postOnSC, setPostOnSC] = useState(false);

  useEffect(() => {
    const postId = router.query.id;
    if (posts.length && postId) {
      const post = posts.find((post) => post.id == postId);
      loading && setLoading(false);
      if (post) {
        setPost(post);
      } else {
        router.push('/browse');
      }
    } else {
      setLoading(true);
      LSP7Contract && fetchPosts();
    }
  }, [posts, router]);

  const addComment = async (e) => {
    const postId = router.query.id;
    e.preventDefault();
    setLoading(true);
    if (account) {
      let cid;
      try {
        const ipfs = ipfsNode();
        const postJson = JSON.stringify({ text: newComment });
        const ipfsResult = await ipfs.add({ content: postJson, pin: true });
        cid = ipfsResult.cid.toString();
        setOnIpfs(true);
      } catch (error) {
        console.log(error);
        setError('We are having trouble with ipfs. Please try again later.');
      }

      try {
        if (cid) {
          const tx = await LSP7Contract.methods
            .createComment(postId, cid)
            .send({ from: account });

          if (tx.status) {
            setNewComment('');
            setPostOnSC(true);
            //add comment to post
            setPost((prevPost) => {
              return {
                ...prevPost,
                comments: [
                  ...prevPost.comments,
                  {
                    id: commentIdCounter + 1,
                    text: newComment,
                    postId,
                    commentor: account,
                  },
                ],
              };
            });

            //replace post in posts
            setPosts((prevPosts) => {
              const newPosts = prevPosts.map((post) => {
                if (post.id == postId) {
                  return {
                    ...post,
                    comments: [
                      ...post.comments,
                      {
                        id: commentIdCounter + 1,
                        text: newComment,
                        postId,
                        commentor: account,
                      },
                    ],
                  };
                }
                return post;
              });
              return newPosts;
            });
            setCommentIdCounter(commentIdCounter + 1);
          }
        }
      } catch (err) {
        console.log(err);
        setError('Error with transaction');
        setLoading(false);
      }
    } else {
      alert('Please connect to Universal Profile Extension or MetaMask');
    }
    setLoading(false);
    setOnIpfs(false);
    setPostOnSC(false);
  };

  const renderComments = () => {
    const postId = router.query.id;
    return post.comments.map((comment, index) => (
      <Comment
        key={index}
        comment={comment}
        setPost={setPost}
        postId={postId}
      />
    ));
  };

  const renderAddComment = () => (
    <form onSubmit={async (e) => await addComment(e)}>
      <textarea
        value={newComment}
        cols="30"
        rows="10"
        placeholder="Add a comment..."
        required
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );

  return (
    <div>
      <Link href={'/browse'}>
        <a className="back">&lt;</a>
      </Link>
      {loading ? <div>Loading...</div> : null}
      {post ? (
        <>
          {account == adminAddress || account == post.author ? (
            <DeletePostBtn postId={post.id} setPosts={setPosts} />
          ) : null}
          <div>
            <h1>{post.title}</h1>
            <p>{post.text}</p>
          </div>
          {post.comments.length ? renderComments() : null}
          {renderAddComment()}
          <div style={{ display: 'flex' }}>
            <LikeBtn setPost={setPost} postId={router.query.id} post={post} />
          </div>
          <Loader
            name="comment"
            setLoading={setLoading}
            loading={loading}
            onIpfs={onIpfs}
            postOnSC={postOnSC}
          />
        </>
      ) : null}
    </div>
  );
};

export default PostPage;
