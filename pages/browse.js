import { useEffect } from 'react';
import { checkMinimalBalance, checkNetwork } from '../utils/connect-extension';
function BrowsePost() {
  console.log('BrowsePost loaded');
  // On mount
  useEffect(() => {
    console.log('BrowsePost useEffect loaded');

    //updateNotifications();
  }, []);
}

export default BrowsePost;
