import type { AppProps } from 'next/app';
import { GlobalStyle } from '../styles/global.styled';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main>
      <GlobalStyle />
      <Component {...pageProps} />
    </main>
  );
}
