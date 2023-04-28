// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { DocumentContext, DocumentInitialProps } from 'next/document';

import { ServerStyleSheet } from 'styled-components';

/**
 * With support for SSR of `styled-components`
 *
 * @see https://github.com/vercel/next.js/blob/51b1fe3d2fbcf4a3cbaec1e684ec3ae257df363c/examples/with-styled-components/pages/_document.tsx
 *
 * @example
 * export default class MyDocument extends DocumentWithStyledComponents {
 *   render() {
 *     ...
 *   }
 * }
 */
export class DocumentWithStyledComponents extends Document {
  static getInitialProps(ctx: DocumentContext) {
    return getInitialPropsForStyledComponentsSSR(ctx);
  }
}

/**
 * With support for SSR of `styled-components`
 *
 * Implemented to prevent these issues: https://github.com/vercel/next.js/issues/40122 and https://stackoverflow.com/a/75020067/11474669
 *
 * @see https://github.com/vercel/next.js/blob/51b1fe3d2fbcf4a3cbaec1e684ec3ae257df363c/examples/with-styled-components/pages/_document.tsx
 *
 * @example
 * export default class MyDocument extends Document {
 *   static getInitialProps(ctx: DocumentContext) {
 *     return getInitialPropsForStyledComponentsSSR(ctx);
 *   }
 * }
 */
export async function getInitialPropsForStyledComponentsSSR(
  ctx: DocumentContext,
): Promise<DocumentInitialProps> {
  const sheet = new ServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [initialProps.styles, sheet.getStyleElement()],
    };
  } finally {
    sheet.seal();
  }
}
