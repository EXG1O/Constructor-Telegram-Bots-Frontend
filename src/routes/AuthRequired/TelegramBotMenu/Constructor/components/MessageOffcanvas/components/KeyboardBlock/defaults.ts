import { defaultType } from './components/KeyboardTypeTabs/defaults';

import type { Keyboard, KeyboardBlockFormValues } from './types';

export const defaultKeyboard: Keyboard = { type: defaultType, rows: [] };
export const defaultKeyboardBlockFormValues: KeyboardBlockFormValues = {
  keyboard: defaultKeyboard,
};
