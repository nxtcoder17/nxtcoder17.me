/* eslint-disable max-len */
import {
  Html, Head, Main, NextScript,
} from 'next/document';

const MyDocument = () => (
  <Html lang="en">
    <Head>
      <title>Today I Learned - nxtcoder17</title>
      <meta name="description" content="this is today i learned from nxtcoder17" />
      <meta name="robots" content="index, follow" />
      <link href="https://fonts.googleapis.com/css2?family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap" rel="stylesheet" async />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default MyDocument;
