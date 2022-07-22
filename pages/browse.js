import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Footer, Notifications } from '../components';
import Head from 'next/head';
import Link from 'next/link';
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
      <Link href={'/dashboard'}>
        <a className="back">&lt;</a>
      </Link>
      <Notifications />
      <div>Browse Page</div>
      <Footer />
    </div>
  );
}

export default BrowsePost;
