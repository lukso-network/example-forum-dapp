import { useEffect } from 'react';
import { useRouter } from 'next/router';

function BrowsePost() {
  const router = useRouter();

  console.log('BrowsePost loaded');
  // On mount
  useEffect(() => {
    console.log('BrowsePost useEffect loaded');

    //updateNotifications();
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
      <div>Browse Page</div>
    </div>
  );
}

export default BrowsePost;
