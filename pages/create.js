import { useEffect } from 'react';
import { useRouter } from 'next/router';

function CreatePost() {
  const router = useRouter();

  console.log('CreatePost loaded');
  // On mount
  useEffect(() => {
    console.log('CreatePost useEffect loaded');
  }, []);

  return (
    <div className="App">
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/milligram/1.2.3/milligram.min.css"
        ></link>
        <meta charset="UTF-8"></meta>
      </Head>
      <Notifications></Notifications>
      <div>Create Page</div>
    </div>
  );
}

export default CreatePost;
