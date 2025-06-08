import * as Primitive from '@radix-ui/react-popover';

import PopoverAnchor from './components/PopoverAnchor';
import PopoverBody from './components/PopoverBody';
import PopoverClose from './components/PopoverClose';
import PopoverTrigger from './components/PopoverTrigger';

export type PopoverProps = Primitive.PopoverProps;

const Popover = Primitive.Popover;
Popover.defaultProps = { modal: false };

export default Object.assign(Popover, {
  Anchor: PopoverAnchor,
  Trigger: PopoverTrigger,
  Body: PopoverBody,
  Close: PopoverClose,
});
