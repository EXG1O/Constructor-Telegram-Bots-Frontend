import React, { ReactElement, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';

export interface ClipboardButtonSlotProps {
  variable: string;
  children: ReactNode;
}

function ClipboardButtonSlot({
  variable,
  children,
}: ClipboardButtonSlotProps): ReactElement {
  return (
    <Slot className='btn-clipboard' data-clipboard-text={`{{ ${variable} }}`}>
      {children}
    </Slot>
  );
}

export default ClipboardButtonSlot;
