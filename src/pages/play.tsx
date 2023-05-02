import Playground from '@/components/Playground';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Canvas App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Canvas Playground application" />
      </Head>
      <main>
        <h1>Canvas Playground</h1>
        <Playground />
      </main>
    </>
  );
}
