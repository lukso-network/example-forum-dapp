import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';
import Link from 'next/link';

function CreatePost() {
  const router = useRouter();

  const [blogpost, setBlockpostValues] = useState({
    title: '',
    text: '',
    authorAddress: '',
    date: '',
  });

  const changeHandler = (e) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [e.target.name]: e.target.value };
    });
  };

  console.log('CreatePost loaded');
  // On mount
  useEffect(() => {
    console.log('CreatePost useEffect loaded');
  }, []);

  return (
    <div className="App">
      <Link href={'/dashboard'}>
        <a className="back">&lt;</a>
      </Link>
      <Notifications />
      <div className="appContainer">
        {' '}
        <h1>Create a post linked to the blockchain</h1>
        <div className="center profile">
          <div className="profileImage">
            <div className="identicon"></div>
            <div className="image"></div>
          </div>
          <span className="username"> {'username'} </span>
          <p className="addressField">{'address'}</p>
          <p className="description">{'description'}</p>
        </div>
        <label>Title</label>
        <input
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
          id="posttext"
          placeholder="Start writing a blogpost..."
          className="textField"
          type="text"
          value={blogpost.text}
          name="title"
          onChange={changeHandler}
        ></textarea>
        <button>submit</button>
      </div>

      <Footer />
    </div>
  );
}

export default CreatePost;
