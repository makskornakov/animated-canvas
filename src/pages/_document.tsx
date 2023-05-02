import { DocumentWithStyledComponents } from '@/plugins/DocumentWithStyledComponents';
import { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends DocumentWithStyledComponents {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="description" content="Canvas Playground" />
          <link rel="icon" href="/favicon.ico" />

          <meta name="theme-color" content="#090909" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
