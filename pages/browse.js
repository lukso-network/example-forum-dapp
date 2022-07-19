import { useEffect } from 'react';
import { checkMinimalBalance, checkNetwork } from '../utils/connect-extension';
import { useRouter } from 'next/router';

function BrowsePost() {
  const router = useRouter();

  console.log('BrowsePost loaded');
  // On mount
  useEffect(() => {
    console.log('BrowsePost useEffect loaded');

    //updateNotifications();
  }, []);
}

export default BrowsePost;
