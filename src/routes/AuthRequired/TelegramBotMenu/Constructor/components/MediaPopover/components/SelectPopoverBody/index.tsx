import React, { type ReactElement } from 'react';

import Popover from 'components/ui/Popover';
import type { PopoverBodyProps } from 'components/ui/Popover/components/PopoverBody';

import SelectFileButton, {
  type SelectFileButtonProps,
} from './components/SelectFileButton';
import SpecifyURLButton from './components/SpecifyURLButton';

import cn from 'utils/cn';

export interface SelectPopoverBodyProps
  extends
    Omit<PopoverBodyProps, 'size' | 'children'>,
    Pick<SelectFileButtonProps, 'accept' | 'multiple'> {}

function SelectPopoverBody({
  accept,
  multiple,
  className,
  ...props
}: SelectPopoverBodyProps): ReactElement {
  return (
    <Popover.Body
      {...props}
      size='sm'
      className={cn('flex', 'flex-col', 'gap-1', className)}
    >
      <SelectFileButton accept={accept} multiple={multiple} className='w-full' />
      <SpecifyURLButton className='w-full' />
    </Popover.Body>
  );
}

export default SelectPopoverBody;
