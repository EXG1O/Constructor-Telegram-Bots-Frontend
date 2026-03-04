import React, { ReactElement } from 'react';
import * as Primitive from '@radix-ui/react-popover';

import PopoverAnchor from './components/PopoverAnchor';
import PopoverBody from './components/PopoverBody';
import PopoverClose from './components/PopoverClose';
import PopoverTrigger from './components/PopoverTrigger';

export interface PopoverProps extends Primitive.PopoverProps {}

function Popover({ modal, ...props }: PopoverProps): ReactElement {
  return <Primitive.Popover {...props} modal={modal} />;
}

export default Object.assign(Popover, {
  Anchor: PopoverAnchor,
  Trigger: PopoverTrigger,
  Body: PopoverBody,
  Close: PopoverClose,
});
