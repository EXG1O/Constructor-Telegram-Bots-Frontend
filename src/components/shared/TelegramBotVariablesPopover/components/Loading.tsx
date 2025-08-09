import React, { HTMLAttributes, ReactElement } from 'react';

import Spinner from 'components/ui/Spinner';

import cn from 'utils/cn';

export interface LoadingProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Loading({ className, ...props }: LoadingProps): ReactElement {
  return (
    <div
      {...props}
      className={cn('flex', 'w-full', 'justify-center', 'items-center', className)}
    >
      <Spinner size='sm' />
    </div>
  );
}

export default Loading;
