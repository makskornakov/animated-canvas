import { DocumentWithStyledComponents } from '@/plugins/DocumentWithStyledComponents';
import { Head, Html, Main, NextScript } from 'next/document';

export default class MyDocument extends DocumentWithStyledComponents {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
