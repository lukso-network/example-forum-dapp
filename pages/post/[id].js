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
    title: 'This is an Example Blogpost',
    text: 'Developing a unified ecosystem with profiles and intertwined token standards is fundamental to an aspiring Web3. Economies will most likely form within distinct networks because of high-capacity utilization on existing networks, the resulting fees, and limited scalability options. By introducing a new ecosystem with innovative standards and tools that enable interoperability, LUKSO will deliver a blockchain for creatives to move Web3 to a mainstream user base. \n Its Layer-1 solution with PoS consensus and sharding will bring light to energy efficiency and scalability. Contract-based accounts will deliver much-needed functionality at the cost of more computation. What may not be a big deal with lower network utilization, relay services will become an essential element to assure ease of use for individuals in the long term. However, capacity limitations should not hinder the emergence and development of promising ideas. \n LSPs can be seen as a confluence of many proposals that were already partially ideated in the Ethereum ecosystem but too early, undefined and infeasible. As the inventor of these new standards, LUKSO is positioned as the first driver of mainstream adoption. If we look back at what has led to the adoption of single standards, like ERC20 or ERC721, we can only assume what this ecosystem of ten well-thought-out building blocks could entail. Let us be excited about the future of blockchain-based profiles. The LUKSO network will be a significant milestone in the evolution of Web3.',
    author: '',
    identicon: '',
    name: 'anonymous',
    date: '3rd March 2022',
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
      loadBlogpost();
    } else {
      setLoading(true);
      LSP7Contract && fetchPosts();
    }
  }, [posts, router]);

  const handleBlogpostValues = (name, value) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  function loadBlogpost() {
    // TODO: Get author form blogpost
    handleBlogpostValues(
      'author',
      '0xFB010D3F1282629a4E9Ef51A355D6AD7B4e2979e'
    );

    const blockie = identicon('0xFB010D3F1282629a4E9Ef51A355D6AD7B4e2979e');

    // generate identicon
    handleBlogpostValues('identicon', blockie);

    // TODO: Get date from blogpost
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '.' + dd + '.' + yyyy;
    handleBlogpostValues('date', today);

    // Trimm title if it has too many characters
    if (blogpost.title.length > 70) {
      handleBlogpostValues('title', blogpost.title.substring(0, 70) + '...');
    } else {
      handleBlogpostValues('title', blogpost.title);
    }

    // Trimm text if it has too many characters
    if (blogpost.text.length > 10000) {
      handleBlogpostValues('text', blogpost.text.substring(0, 10000) + '...');
    } else {
      handleBlogpostValues('text', blogpost.text);
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
                    {post.likes.length ? <a>{post.likes.length} </a> : '0'}
                    likes and {blogpost.comments.length} comments since{' '}
                    {blogpost.date}
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
            {post.comments.length ? renderComments() : null}

            <Loader
              name="comment"
              setLoading={setLoading}
              loading={loading}
              onIpfs={onIpfs}
              postOnSC={postOnSC}
            />
          </div>
        </>
      ) : null}
    </div>
  );
};

export default PostPage;
