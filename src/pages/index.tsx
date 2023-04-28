import Canvas from '@/components/Canvas';
import Head from 'next/head';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
        <title>Noise Generation</title>
        <meta name="description" content="Noise Generation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main>
        <h1>Noise Generation</h1>

        <Canvas />
      </main>
    </>
  );
}
