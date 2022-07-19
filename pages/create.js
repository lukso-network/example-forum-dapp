import { useEffect } from 'react';
import { checkMinimalBalance, checkNetwork } from '../utils/connect-extension';
import { useRouter } from 'next/router';

function CreatePost() {
  const router = useRouter();

  console.log('CreatePost loaded');
  // On mount
  useEffect(() => {
    console.log('CreatePost useEffect loaded');
  }, []);
}

export default CreatePost;
