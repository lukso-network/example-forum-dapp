import { useRouter } from 'next/router';
import { useEffect, useContext } from 'react';
import { GlobalContext } from '../contexts/GlobalContext';

const ErrorPage = () => {
  const router = useRouter();
  const { account } = useContext(GlobalContext);

  useEffect(() => {
    account ? router.push('/browse') : router.push('login');
  }, []);

  return <div />;
};

export default ErrorPage;
