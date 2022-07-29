import { Footer, Notifications } from '../components';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import Post from '../components/browser/Post';

function BrowsePost() {
  const { posts } = useContext(GlobalContext);

  const renderPosts = () => {
    return (
      <>
        {posts.map((post, index) => (
          <div key={index}>
            <Post
              title={post.title}
              text={post.text}
              comments={post.comments}
              likes={post.likes}
              postId={post.id}
            />
          </div>
        ))}
      </>
    );
  };

  useEffect(() => {
    console.log(posts, 'posts');
  }, [posts]);

  return (
    <div className="App">
      <Link href={'/dashboard'}>
        <a className="back">&lt;</a>
      </Link>
      <Notifications />
      <h1>Browse Page</h1>
      {posts.length ? renderPosts() : null}
      <Footer />
    </div>
  );
}

export default BrowsePost;
