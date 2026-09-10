import React, { memo, type ReactElement } from 'react';

import Container from 'components/ui/Container';

import FooterCopyright from './components/FooterCopyright';
import FooterIconButtons from './components/FooterIconButtons';
import FooterLinks from './components/FooterLinks';

function Footer(): ReactElement {
  return (
    <Container asChild>
      <footer className='flex flex-wrap py-2 max-md:gap-2 md:grid md:grid-cols-6'>
        <FooterCopyright className='max-md:-mb-2 max-md:text-center md:col-span-1' />
        <FooterLinks className='flex-wrap max-md:gap-1 max-md:text-center max-md:*:w-full md:col-span-4' />
        <FooterIconButtons className='max-md:justify-center md:col-span-1' />
      </footer>
    </Container>
  );
}

export default memo(Footer);
