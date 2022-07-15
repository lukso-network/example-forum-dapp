import { useEffect } from 'react';
import { checkMinimalBalance, checkNetwork } from '../utils/connect-extension';
function CreatePost() {
  console.log('CreatePost loaded');
  // On mount
  useEffect(() => {
    console.log('CreatePost useEffect loaded');
  }, []);
}

export default CreatePost;
