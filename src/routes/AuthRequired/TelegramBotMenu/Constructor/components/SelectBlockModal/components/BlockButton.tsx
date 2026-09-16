import React, { type ReactElement } from 'react';

import Button, { type ButtonProps } from 'components/ui/Button';
import ModalClose from 'components/ui/Modal/components/ModalClose';

import cn from 'utils/cn';

export interface BlockButtonProps extends Omit<ButtonProps, 'size' | 'variant'> {
  name: string;
  description: string;
}

function BlockButton({
  name,
  description,
  className,
  ...props
}: BlockButtonProps): ReactElement {
  return (
    <ModalClose asChild>
      <Button
        {...props}
        size='sm'
        variant='light'
        className={cn(
          'flex',
          'flex-col',
          'min-h-16',
          'p-1',
          'gap-0',
          'justify-start',
          className,
        )}
      >
        <h3 className='text-base font-medium'>{name}</h3>
        <p className='text-xs'>{description}</p>
      </Button>
    </ModalClose>
  );
}

export default BlockButton;
