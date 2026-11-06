import { defaultDefaultTypeOnly } from './components/DefaultTypeOnlySection/defaults';
import { defaultType } from './components/KeyboardTypeTabs/defaults';

import type { Keyboard, KeyboardBlockFormValues } from './types';

export const defaultKeyboard: Keyboard = {
  type: defaultType,
  default_type_only: defaultDefaultTypeOnly,
  rows: [],
};
export const defaultKeyboardBlockFormValues: KeyboardBlockFormValues = {
  keyboard: defaultKeyboard,
};
