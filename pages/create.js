import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';
import Link from 'next/link';
import Profile from '../components/profile';
import { GlobalContext } from '../contexts/GlobalContext';
// before
// import * as IPFS from 'ipfs-core';
import * as IPFS from 'ipfs';

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
    console.log(JSON.stringify(blogpost));
    // Connect with IPFS node
    const node = await IPFS.create();

    // Upload Title and Text to IPFS
    try {
      if (node.isOnline()) {
        const IPFSPost = {
          path: '/tmp/post.txt', // imaginary filename
          content: JSON.stringify(blogpost),
        };

        console.log('starting post upload');
        const result = await node.add(IPFSPost);

        //console.log('pinning file...');
        //await node.pin.add(result.cid);

        const cid = result.cid.toString();
        console.log('IPFS upload complete: ', cid);
      } else {
        console.log('Cannot connect with IPFS node');
      }

      /*
      const data = 'Hello, <YOUR NAME HERE>';

      // add your data to IPFS - this can be a string, a Buffer,
      // a stream of Buffers, etc
      const results = node.add(data);

      // we loop over the results because 'add' supports multiple
      // additions, but we only added one entry here so we only see
      // one log line in the output
      for await (const { cid } of results) {
        // CID (Content IDentifier) uniquely addresses the data
        // and can be used to get it again.
        console.log(cid.toString());
        
      }*/
    } catch (error) {
      console.warn('Failed IPFS Upload:', error);
      await node.stop();
      console.log('IPFS node stopped');
    }

    return;
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
