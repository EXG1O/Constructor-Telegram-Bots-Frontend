import type { ReactElement } from 'react';
import React from 'react';
import * as Primitive from '@radix-ui/react-dropdown-menu';

import DropdownMenu from './components/DropdownMenu';
import DropdownTrigger from './components/DropdownTrigger';

export interface DropdownProps extends Primitive.DropdownMenuProps {}

function Dropdown({ modal, ...props }: DropdownProps): ReactElement {
  return <Primitive.DropdownMenu {...props} modal={modal} />;
}

export default Object.assign(Dropdown, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
});
