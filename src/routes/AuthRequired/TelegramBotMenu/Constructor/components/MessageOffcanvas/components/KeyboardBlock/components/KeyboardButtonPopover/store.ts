import { create } from 'zustand';

import { defaultText, Text } from './components/TextInput';
import { defaultURL, URL } from './components/URLInput';

import { KeyboardButton } from '../Keyboard/components/DraggableKeyboardButton';

export interface StateData {
  text: Text;
  url: URL;

  showURLInput: boolean;
  errors: Record<string, string>;
}

export interface StateActions {
  initialize: (button?: KeyboardButton) => void;

  setText: (text: Text) => void;
  setURL: (url: URL) => void;

  setShowURLInput: (show: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
}

export type State = StateData & StateActions;

function getData(button?: KeyboardButton): StateData {
  return {
    text: button?.text ?? defaultText,
    url: button?.url ?? defaultURL,

    showURLInput: Boolean(button?.url),
    errors: {},
  };
}

export const useKeyboardButtonPopoverStore = create<State>((set) => ({
  ...getData(),

  initialize: (button) => set(getData(button)),

  setText: (text) => set({ text }),
  setURL: (url) => set({ url }),

  setShowURLInput: (show) => set({ showURLInput: show }),
  setErrors: (errors) => set({ errors }),
}));
