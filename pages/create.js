import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';
import Link from 'next/link';
import Profile from '../components/profile';
import { GlobalContext } from '../contexts/GlobalContext';

function CreatePost() {
  const [blogpost, setBlockpostValues] = useState({
    title: '',
    text: '',
  });

  const [error, setError] = useState('');

  const router = useRouter();

  const {
    account,
    posts,
    setPosts,
    LSP7Contract,
    tokenIdCounter,
    setTokenIdCounter,
  } = useContext(GlobalContext);

  function changeHandler(e) {
    setError('');
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  }

  async function createPost(e) {
    e.preventDefault();
    if (!ethereum) {
      alert('Please install Universal Profile Extension or Meth');
    }

    // Upload Title and Text to IPFS
    try {
    } catch (error) {
      console.warn('Failed IPFS Upload:', error);
    }

    try {
      const tx = await LSP7Contract.methods
        .createPost(blogpost.title, blogpost.text)
        .send({ from: account });
      if (tx.status) {
        setPosts([
          ...posts,
          {
            title: blogpost.title,
            text: blogpost.text,
            author: account,
            id: tokenIdCounter + 1,
            comments: [],
            likes: [],
          },
        ]);
        setTokenIdCounter((s) => s + 1);

        router.push('/browse');
      }
    } catch (err) {
      if (err.code == 4001) {
        console.log('User rejected transaction');
        return;
      }
      console.log(err, 'err');
      setError('Error with transaction');
    }
  }

  return (
    <div className="App">
      <Link href={'/dashboard'}>
        <a className="back">&lt;</a>
      </Link>
      <Notifications />
      <div className="appContainer">
        <h1>Create a post linked to the blockchain</h1>
        <Profile />
        {error ? (
          <div className="warning center">{error}</div>
        ) : (
          <div id="error" />
        )}
        <form
          onSubmit={function (e) {
            createPost(e);
          }}
        >
          <label>Title</label>
          <input
            required
            className="titleField"
            placeholder="What are you writing about?"
            id="posttitle"
            type="text"
            value={blogpost.title}
            name="title"
            onChange={changeHandler}
          ></input>
          <br />
          <label>Text</label>
          <textarea
            required
            id="posttext"
            placeholder="Start writing a blogpost..."
            className="textField"
            type="text"
            value={blogpost.text}
            name="text"
            onChange={changeHandler}
          ></textarea>
          <button type="submit">submit</button>
        </form>
        <div id="status">{blogpost.status}</div>
      </div>
      <Footer />
    </div>
  );
}

export default CreatePost;
