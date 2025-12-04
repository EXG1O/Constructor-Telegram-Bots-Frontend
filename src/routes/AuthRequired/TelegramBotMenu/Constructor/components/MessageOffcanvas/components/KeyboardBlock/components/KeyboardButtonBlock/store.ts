import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Text } from './components/TextInput';
import { defaultURL, URL } from './components/URLInput';

import { KeyboardButton } from '../Keyboard/components/DraggableKeyboardButton';

export interface KeyboardButtonBlockSliceState {
  keyboardButtonBlock: {
    rowIndex: number | null;
    buttonIndex: number | null;

    type: 'add' | 'edit';
    show: boolean;
    showURLInput: boolean;
    errors: Record<string, string | undefined>;

    text: Text;
    url: URL;
  };
}

export interface KeyboardButtonBlockSliceActions {
  keyboardButtonBlock: {
    setRowIndex: (rowIndex: number) => void;
    setButtonIndex: (buttonIndex: number) => void;

    showBlock: (
      button?: KeyboardButton,
      rowIndex?: number,
      buttonIndex?: number,
    ) => void;
    hideBlock: () => void;

    setShowURLInput: (show: boolean) => void;
    setErrors: (errors: Record<string, string | undefined>) => void;

    setText: (text: Text) => void;
    setURL: (url: URL) => void;
  };
}

export type KeyboardButtonBlockSlice = KeyboardButtonBlockSliceState &
  KeyboardButtonBlockSliceActions;

export const createKeyboardButtonBlockSlice: StateCreator<
  KeyboardButtonBlockSlice,
  [],
  [['zustand/immer', never]]
> = immer((set) => ({
  keyboardButtonBlock: {
    rowIndex: null,
    buttonIndex: null,

    type: 'add',
    show: false,
    showURLInput: false,
    errors: {},

    text: '',
    url: '',

    setRowIndex: (rowIndex) =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.rowIndex = rowIndex;
      }),
    setButtonIndex: (buttonIndex) =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.buttonIndex = buttonIndex;
      }),

    showBlock: (button, rowIndex, buttonIndex) =>
      set(({ keyboardButtonBlock }) => {
        if (button && rowIndex !== undefined && buttonIndex !== undefined) {
          keyboardButtonBlock.rowIndex = rowIndex;
          keyboardButtonBlock.buttonIndex = buttonIndex;
          keyboardButtonBlock.type = 'edit';
          keyboardButtonBlock.text = button.text;
          keyboardButtonBlock.url = button.url ?? defaultURL;
        } else {
          keyboardButtonBlock.rowIndex = null;
          keyboardButtonBlock.buttonIndex = null;
          keyboardButtonBlock.type = 'add';
          keyboardButtonBlock.text = '';
          keyboardButtonBlock.url = '';
        }

        keyboardButtonBlock.show = true;
        keyboardButtonBlock.showURLInput = Boolean(keyboardButtonBlock.url);
        keyboardButtonBlock.errors = {};
      }),
    hideBlock: () =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.rowIndex = null;
        keyboardButtonBlock.buttonIndex = null;
        keyboardButtonBlock.show = false;
      }),

    setShowURLInput: (show) =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.showURLInput = show;
      }),
    setErrors: (errors) =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.errors = errors;
      }),

    setText: (text) =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.text = text;
      }),
    setURL: (url) =>
      set(({ keyboardButtonBlock }) => {
        keyboardButtonBlock.url = url;
      }),
  },
}));
