import React, { type ReactElement } from 'react';

import IconButton, { type IconButtonProps } from 'components/ui/IconButton';

import ClipboardIcon from './ClipboardIcon';
import ClipboardSlot, { type ClipboardSlotProps } from './ClipboardSlot';

export interface ClipboardButtonProps
  extends Omit<IconButtonProps, 'value'>, Pick<ClipboardSlotProps, 'value'> {}

function ClipboardButton({ value, ...props }: ClipboardButtonProps): ReactElement {
  return (
    <ClipboardSlot value={value}>
      <IconButton {...props}>
        <ClipboardIcon />
      </IconButton>
    </ClipboardSlot>
  );
}

export default ClipboardButton;
