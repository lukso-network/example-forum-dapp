import { useRouter } from 'next/router';
import identicon from 'ethereum-blockies-base64';
import { useEffect, useState } from 'react';

const Post = ({ title, text, likes, postId }) => {
  const router = useRouter();
  const identiconPicture = '';
  const accounts = '';

  // On mount
  useEffect(() => {
    loadIdenticonPicture();
  }, []);

  const [blogpost, setBlockpostValues] = useState({
    title: '',
    text: '',
    author: '',
    identicon: '',
    name: 'anonymous',
    date: '3rd March 2022',
    profilePicture: '',
    likes: 0,
    comments: [],
  });

  const handleBlogpostValues = (name, value) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  async function loadIdenticonPicture() {
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
    if (title.length > 20) {
      handleBlogpostValues('title', title.substring(0, 20) + '...');
    } else {
      handleBlogpostValues('title', title);
    }

    // Trimm text if it has too many characters
    if (text.length > 100) {
      handleBlogpostValues('text', text.substring(0, 100) + '...');
    } else {
      handleBlogpostValues('text', text);
    }
  }

  return (
    <div onClick={() => router.push(`/post/${postId}`)} className="post">
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
                backgroundImage: 'url(' + blogpost.profilePicture + ')',
              }}
            ></div>
          </div>
          <div>@{blogpost.name}</div>
        </div>
      </div>
      <div className="postRight">
        <div className="">
          {blogpost.likes} likes and {blogpost.comments.length} comments since{' '}
          {blogpost.date}
        </div>
        <h4> {blogpost.title}</h4>
        <p className="textPreview">{blogpost.text}</p>
      </div>
    </div>
  );
};

export default Post;
