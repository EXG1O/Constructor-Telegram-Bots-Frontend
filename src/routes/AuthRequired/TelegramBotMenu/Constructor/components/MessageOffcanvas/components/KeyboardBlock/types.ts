import type { KeyboardRow } from './components/DraggableKeyboard';
import type { Type } from './components/KeyboardTypeTabs/enums';

export interface Keyboard {
  type: Type;
  rows: KeyboardRow[];
}

export interface KeyboardBlockFormValues {
  keyboard: Keyboard;
}
