import type { DefaultTypeOnly } from './components/DefaultTypeOnlySection/types';
import type { KeyboardRow } from './components/DraggableKeyboard';
import type { Type } from './components/KeyboardTypeTabs/enums';

export interface Keyboard {
  type: Type;
  default_type_only: DefaultTypeOnly;
  rows: KeyboardRow[];
}

export interface KeyboardBlockFormValues {
  keyboard: Keyboard;
}
