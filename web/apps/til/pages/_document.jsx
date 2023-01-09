import {
  Html, Head, Main, NextScript,
} from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <link href="https://fonts.googleapis.com/css2?family=Nova+Mono&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Recursive&display=swap" rel="stylesheet" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
