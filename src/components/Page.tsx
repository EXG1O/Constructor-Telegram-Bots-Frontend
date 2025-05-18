import React, { memo, ReactElement, ReactNode } from 'react';
import classNames from 'classnames';

import Container from 'components/ui/Container';
import Title from './Title';

import('./Stack.scss');

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
  const containerClassName: string = classNames('my-2 my-lg-3', { 'vstack gap-3 gap-lg-4': grid }, className)

  return (
    <Title title={title}>
      {align === 'center' ? (
        <main className='my-auto'>
          <Container className={containerClassName}>
            {children}
          </Container>
        </main>
      ) : (
        <Container asChild className={containerClassName}>
          <main>
            {children}
          </main>
        </Container>
      )}
    </Title>
  );
}

export default memo(Page);
