import Link from 'next/link';
import { CentralContainer, CustomLink, FooterContainer, LandingContainer } from './Landing.styled';

export default function Landing() {
  return (
    <LandingContainer>
      <h1>Canvas Experiments</h1>
      <CentralContainer>
        <div>
          <h2>Space Background Interactive Playground</h2>
          <p>
            Points are distributed on the canvas and then grown to their maximum size. From the
            resultant map, images like space with stars, planets and galaxies, or some organic
            visualisations can be created. Discover more by playing with generation and display
            settings.
            <br />
            <Link href="">Read more</Link>
          </p>

          <CustomLink href="/space">Play Space</CustomLink>
        </div>
        <div>
          <h2>General Canvas Interactive Playground</h2>
          <p>
            Debugging playground for canvas animations. Change settings without disturbing the tick
            and see console.log(s) being called. Set the overlay helping canvas to visualize
            settings better.
            <br />
            <Link href="">Read more</Link>
          </p>

          <CustomLink href="/play">Play Example</CustomLink>
        </div>
      </CentralContainer>
      <FooterContainer>
        <h4>Play with Code</h4>
        <p>
          Visit the <Link href="https://github.com/makskornakov/animated-canvas">GitHub repo</Link>{' '}
          of the project. <br />
          Adjust deeper settings and apply your own ideas for any needs. Feel free to share your
          findings and creations.
        </p>
        <Link href="https://github.com/makskornakov" target="_blank">
          Makskornakov
        </Link>
      </FooterContainer>
    </LandingContainer>
  );
}
