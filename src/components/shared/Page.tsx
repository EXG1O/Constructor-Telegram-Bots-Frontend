import React, { ReactElement, ReactNode, useEffect } from 'react';
import { Slot } from '@radix-ui/react-slot';

import Container from 'components/ui/Container';

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
  const containerClassName: string = cn('my-2', 'lg:my-3', className);

  useEffect(() => {
    document.title = `${title} - Constructor Telegram Bots`;
  }, [title]);

  return (
    <Slot className={grid ? 'flex flex-auto flex-col gap-3 lg:gap-4' : undefined}>
      {align === 'center' ? (
        <main className='my-auto'>
          <Container className={containerClassName}>{children}</Container>
        </main>
      ) : (
        <Container asChild className={containerClassName}>
          <main>{children}</main>
        </Container>
      )}
    </Slot>
  );
}

export default Page;
