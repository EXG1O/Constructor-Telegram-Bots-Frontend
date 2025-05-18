import React, { CSSProperties, memo, ReactElement, ReactNode } from 'react';

import Spinner from 'components/ui/Spinner';

import { useCommandOffcanvasStore } from '../../../store';

export interface ImagesLoadingProps {
  children: ReactNode;
}

const blockStyle: CSSProperties = { height: '202px' };

function ImagesLoading({
  children,
}: ImagesLoadingProps): ReactElement<ImagesLoadingProps> | ReactNode {
  const loading = useCommandOffcanvasStore((state) => state.imagesLoading);

  return loading ? (
    <div
      className='d-flex justify-content-center bg-light border rounded'
      style={blockStyle}
    >
      <Spinner size='md' className='align-self-center' />
    </div>
  ) : (
    children
  );
}

export default memo(ImagesLoading);
