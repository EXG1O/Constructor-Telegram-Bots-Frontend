import React, { HTMLAttributes, memo, ReactElement } from 'react';
import classNames from 'classnames';

import('./Loading.scss');

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  size: Size;
}

function Loading({
  size,
  className,
  ...props
}: LoadingProps): ReactElement<LoadingProps> {
  return (
    <div {...props} className={classNames(`loading loading-${size}`, className)} />
  );
}

export default memo(Loading);
