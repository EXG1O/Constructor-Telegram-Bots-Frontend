import React, { ReactElement } from 'react';

import Spinner, { SpinnerProps } from 'components/ui/Spinner';

import useCodeInputStore from 'components/ui/CodeInput/hooks/useCodeInputStore';

import { Size } from '../../..';

const SIZE_MAP: Record<Size, NonNullable<SpinnerProps['size']>> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

function Loading(): ReactElement {
  const size = useCodeInputStore((state) => state.size);

  return (
    <div className='flex items-center justify-center'>
      <Spinner size={SIZE_MAP[size]} />
    </div>
  );
}

export default Loading;
