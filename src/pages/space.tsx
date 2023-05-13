import SpacePlayground from '@/components/Background/SpacePlayground';
// import SpaceBackground from '@/components/Background/SpacePlayground';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Space Playground</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Space Playground" />
      </Head>
      <SpacePlayground />
    </>
  );
}
