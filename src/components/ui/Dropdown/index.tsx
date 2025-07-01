import * as Primitive from '@radix-ui/react-dropdown-menu';

import DropdownMenu from './components/DropdownMenu';
import DropdownTrigger from './components/DropdownTrigger';

export type DropdownProps = Primitive.DropdownMenuProps;

const Dropdown = Primitive.DropdownMenu;
Dropdown.defaultProps = { modal: false };
Dropdown.displayName = 'Dropdown';

export default Object.assign(Dropdown, {
  Trigger: DropdownTrigger,
  Menu: DropdownMenu,
});
