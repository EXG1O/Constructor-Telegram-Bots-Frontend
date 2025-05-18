import React, { Fragment, ReactElement, ReactNode, useEffect } from 'react';

import Container from 'components/ui/Container';
import Stack from 'components/ui/Stack';

import cn from 'utils/cn';

export interface PageProps {
  title: string;
  align?: 'center';
  grid?: boolean;
  className?: string;
  children: ReactNode;
}

function Page({
  title,
  align,
  grid,
  className,
  children,
}: PageProps): ReactElement<PageProps> {
  const Wrapper = grid ? Stack : Fragment;
  const containerClassName: string = cn('my-2', 'lg:my-3', className);

  useEffect(() => {
    document.title = `${title} - Constructor Telegram Bots`;
  }, [title]);

  return (
    <Wrapper asChild className='gap-3 lg:gap-4'>
      {align === 'center' ? (
        <main className='my-auto'>
          <Container className={containerClassName}>{children}</Container>
        </main>
      ) : (
        <Container asChild className={containerClassName}>
          <main>{children}</main>
        </Container>
      )}
    </Wrapper>
  );
}

export default Page;
