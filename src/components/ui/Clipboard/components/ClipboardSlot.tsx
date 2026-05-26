import React, { type ReactElement } from 'react';
import { Slot } from '@radix-ui/react-slot';

import useClipboard from '../hooks/useClipboard';

export interface ClipboardSlotProps {
  value: string;
  children: ReactElement;
}

function ClipboardSlot({ value, children }: ClipboardSlotProps): ReactElement {
  const { triggerClassName } = useClipboard();

  return (
    <Slot className={triggerClassName} data-clipboard-text={value}>
      {children}
    </Slot>
  );
}

export default ClipboardSlot;
