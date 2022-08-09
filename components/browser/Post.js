import { useRouter } from 'next/router';
import identicon from 'ethereum-blockies-base64';
import { useEffect, useState } from 'react';

const Post = ({ title, text, likes, postId, comments, name,
  profilePicture, authorAddress, date }) => {
  const router = useRouter();
  const identiconPicture = '';
  const accounts = '';

  // On mount
  useEffect(() => {
    loadIdenticonPicture();
    formatText()
    formatDate()
  }, []);

  const [blogpost, setBlockpostValues] = useState({
    title: '',
    text: '',
    author: '',
    identicon: '',
    name: 'anonymous',
    date: '',
    profilePicture: '',
    likes: 0,
    comments: [],
  });

  const handleBlogpostValues = (name, value) => {
    setBlockpostValues((prevValues) => {
      return { ...prevValues, [name]: value };
    });
  };

  const formatDate = () => {

        var today = new Date(date);
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '.' + mm + '.' + yyyy;
        handleBlogpostValues('date', today);
  }

  const formatText = () => {
        // Trimm title if it has too many characters
      if (title.length > 32) {
        handleBlogpostValues('title', title.substring(0, 32) + '...');
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

  async function loadIdenticonPicture() {

    const blockie = identicon(authorAddress);

    // generate identicon
    handleBlogpostValues('identicon', blockie);


    // Trimm title if it has too many characters
    if (title.length > 32) {
      handleBlogpostValues('title', title.substring(0, 32) + '...');
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
            {
              profilePicture ?
              (
                <div
                  className="image"
                  id="image"
                  style={{
                    backgroundImage: 'url(' + profilePicture + ')',
                  }}
                ></div>
              ):
              (
              <div
                className="image" d
                id="image"
              ></div>
              )
            }

          </div>
          {
            name? (
              <a
                href={`https://l16.universalprofile.cloud/${authorAddress}`}
                target='_blank'
                rel="noreferrer"
              >
                @{name}
              </a>
            ):
              '@anonymous'
          }
        </div>
      </div>
      <div className="postRight">
        <div className="">
          {likes.length} {likes.length > 1? 'likes':'like'} and {comments.length}
          {comments.length > 1? ' comments': ' comment'} since{' '}
          {blogpost.date}
        </div>
        <h4> {blogpost.title}</h4>
        <p className="textPreview">{blogpost.text}</p>
      </div>
    </div>
  );
};

export default Post;
