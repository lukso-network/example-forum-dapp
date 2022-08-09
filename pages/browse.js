import { useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';
import Post from '../components/browser/Post';
import { useRouter } from 'next/router';
import Image from 'next/image';

function BrowsePost() {
  const { posts } = useContext(GlobalContext);

  const router = useRouter();

  const renderPosts = () => {
    return (
      <div className="rightBrowsePage">
        {posts.map((post, index) => (
          <div key={index}>
            <Post
              title={post.title}
              text={post.text}
              comments={post.comments}
              likes={post.likes}
              postId={post.id}
              name={post.authorAttrs.name}
              profilePicture={post.authorAttrs.profilePicture}
              authorAddress={post.author}
              date={post.date}
            />
          </div>
        ))}
      </div>
    );
  };

  const showPlaceholder = () => {
    return (
      <div className="rightEmptyPage">
        <Image src="/empty-up.png" width="150" height="150" />
        <div>No forum posts yet.</div>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Sample Forum dApp</h1>
      <div className="pageWrapper">
        <div className="leftBrowsePage">
          <button className="nav-link" onClick={() => router.push('/create')}>
            Create New Post
          </button>
        </div>
        {!posts.length ? showPlaceholder() : null}
        {posts.length ? renderPosts() : null}
      </div>
    </div>
  );
}

export default BrowsePost;
