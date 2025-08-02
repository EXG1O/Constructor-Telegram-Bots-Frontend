import React, { forwardRef } from 'react';
import { DialogTrigger, DialogTriggerProps } from '@radix-ui/react-dialog';

export interface ModalTriggerProps extends DialogTriggerProps {}

const ModalTrigger = forwardRef<HTMLButtonElement, ModalTriggerProps>((props, ref) => {
  return <DialogTrigger {...props} ref={ref} />;
});
ModalTrigger.displayName = 'ModalTrigger';

export default ModalTrigger;
