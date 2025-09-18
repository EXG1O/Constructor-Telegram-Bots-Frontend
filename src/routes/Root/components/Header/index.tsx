import React, { memo, ReactElement } from 'react';

import Container from 'components/ui/Container';

import HeaderButtons from './components/HeaderButtons';
import HeaderLinks from './components/HeaderLinks';
import HeaderLogo from './components/HeaderLogo';

function Header(): ReactElement {
  return (
    <Container asChild>
      <nav className='flex flex-wrap gap-2 py-2 lg:flex-nowrap xl:grid xl:grid-cols-4'>
        <HeaderLogo />
        <HeaderLinks />
        <HeaderButtons />
      </nav>
    </Container>
  );
}

export default memo(Header);
