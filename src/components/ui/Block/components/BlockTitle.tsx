import React, { HTMLAttributes, ReactElement } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface BlockTitleProps extends HTMLAttributes<HTMLElement> {
  children: ReactElement;
}

function BlockTitle({ className, ...props }: BlockTitleProps): ReactElement {
  return <Slot {...props} className={cn('w-full', 'text-center', className)} />;
}

export default BlockTitle;
