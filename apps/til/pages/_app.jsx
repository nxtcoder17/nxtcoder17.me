import Head from 'next/head';
import 'pkg/css/global.css';

const App = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>nxtcoder17&apos;s corner</title>
    </Head>
    <Component {...pageProps} />
  </>
);

export default App;
