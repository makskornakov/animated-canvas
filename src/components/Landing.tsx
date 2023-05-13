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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Vitae congue eu consequat ac felis donec
            et. Nulla pharetra diam sit amet nisl suscipit adipiscing. Viverra maecenas accumsan
            lacus vel. Urna porttitor rhoncus dolor purus non enim praesent elementum.
            <br />
            <Link href="">Read more</Link>
          </p>

          <CustomLink href="/space">Play Space</CustomLink>
        </div>
        <div>
          <h2>General Canvas Interactive Playground</h2>
          <p>
            Ac odio tempor orci dapibus ultrices in iaculis. Senectus et netus et malesuada. Egestas
            integer eget aliquet nibh praesent tristique magna sit. In hac habitasse platea dictumst
            vestibulum. Viverra orci sagittis eu volutpat. Enim nulla aliquet porttitor lacus
            luctus. Vestibulum morbi blandit cursus risus at. sed cras ornare arcu dui.
            <br />
            <Link href="">Read more</Link>
          </p>

          <CustomLink href="/play">Play Canvas</CustomLink>
        </div>
      </CentralContainer>
      <FooterContainer>
        <h4>Some footer text</h4>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Vitae congue eu consequat ac felis donec et. Nulla
          pharetra diam sit amet nisl suscipit adipiscing. Viverra maecenas accumsan lacus vel. Urna
          porttitor rhoncus dolor purus non enim praesent elementum.
        </p>
        <Link href="https://github.com/makskornakov" target="_blank">
          Makskornakov
        </Link>
      </FooterContainer>
    </LandingContainer>
  );
}
