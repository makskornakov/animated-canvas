import Canvas from '@/components/Canvas';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Canvas Playground</title>
        <meta name="description" content="Canvas Playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Canvas Playground</h1>
        <Canvas />
      </main>
    </>
  );
}
