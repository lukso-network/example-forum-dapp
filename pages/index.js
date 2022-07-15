import { Footer } from '../components';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
export default function Home({ UpAddress }) {
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
      <div className={styles.container}>{UpAddress}</div>
      <Footer />
    </div>
  );
}

export async function getStaticProps() {
  // code goes here
  return {
    props: {
      UpAddress: '',
    },
  };
}
