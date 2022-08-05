import GlobalProvider from '../contexts/GlobalContext';
import '../styles/globals.css';
import { Notifications, Footer } from '../components/shared';

function MyApp({ Component, pageProps }) {
  return (
    <GlobalProvider>
      <Notifications />
      <Component {...pageProps} />
      <Footer />
    </GlobalProvider>
  );
}

export default MyApp;
