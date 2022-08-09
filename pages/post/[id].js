import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../contexts/GlobalContext';
import Comment from '../../components/post/Comment';
import Link from 'next/link';
import LikeBtn from '../../components/post/LikeBtn';
import ipfsNode from '../../utils/ipfs-node';
import DeletePostBtn from '../../components/post/DeletePostBtn';
import Loader from '../../components/shared/loader';
import identicon from 'ethereum-blockies-base64';

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

  const [blogpost, setBlockpostValues] = useState({
    title: '',
    text: '',
    author: '',
    identicon: '',
    name: 'anonymous',
    profilePicture: '',
    likes: 0,
    comments: [],
  });

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

  useEffect(() => {
    if(post){
      console.log(post, 'post from here')
      loadBlogpost();
    }
  }, [post])

  const handleBlogpostValues = (name, value) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  function loadBlogpost() {
    const blockie = identicon( post.author);
    // generate identicon
    handleBlogpostValues('identicon', blockie);

    // TODO: Get date from blogpost
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '.' + dd + '.' + yyyy;
    handleBlogpostValues('date', today);

    if(post.authorAttrs.profilePicture){
      handleBlogpostValues('profilePicture', post.authorAttrs.profilePicture);
    }

    if(post.authorAttrs.name){
      handleBlogpostValues('name', post.authorAttrs.name);
    }
  }

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
        className="commentArea"
        value={newComment}
        cols="30"
        rows="10"
        placeholder="Add a comment..."
        required
        onChange={(e) => setNewComment(e.target.value)}
      />
      <button type="submit" className="commentButton">
        Submit comment
      </button>
    </form>
  );

  return (
    <div className="App">
      <Link href={'/browse'}>
        <a className="back">&lt;</a>
      </Link>
      {loading ? <div>Loading...</div> : null}
      {post ? (
        <>
          <div className="pageWrapperTop">
            <div className="blogPostPage">
              <div className="fullpost">
                <div className="postLeft">
                  <div className="postprofile">
                    <div className="profileImage">
                      <div
                        className="identicon"
                        style={{
                          backgroundImage: 'url(' + blogpost.identicon + ')',
                        }}
                        id="identicon"
                      ></div>
                      <div
                        className="image"
                        id="image"
                        style={{
                          backgroundImage:
                            'url(' + blogpost.profilePicture + ')',
                        }}
                      ></div>
                    </div>
                    <div>@{blogpost.name}</div>
                  </div>
                </div>
                <div className="postRight">
                  <div className="">
                    {post.likes.length ? <a>{post.likes.length} </a> : '0 '}
                    likes and {post.comments.length} comments since{' '}
                    {post.date}
                  </div>
                  <h4> {post.title}</h4>
                  <p className="textPreview">{post.text}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pageWrapperBottom ">
            <div className="postInteraction">
              {account == adminAddress || account == post.author ? (
                <DeletePostBtn postId={post.id} setPosts={setPosts} />
              ) : null}
              <LikeBtn setPost={setPost} postId={router.query.id} post={post} />
            </div>
          </div>
          <div className="socialSection">
            {renderAddComment()}

            <Loader
              name="comment"
              setLoading={setLoading}
              loading={loading}
              onIpfs={onIpfs}
              postOnSC={postOnSC}
            />
          </div>
          <div className="pageWrapper">
            {' '}
            {post.comments.length ? renderComments() : null}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PostPage;
