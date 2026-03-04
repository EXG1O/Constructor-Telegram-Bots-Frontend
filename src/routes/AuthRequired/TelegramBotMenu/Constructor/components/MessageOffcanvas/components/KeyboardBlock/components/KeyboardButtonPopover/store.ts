import { create } from 'zustand';

import { defaultStyle, type Style } from './components/StyleSelect';
import { defaultText, type Text } from './components/TextInput';
import { defaultURL, type URL } from './components/URLInput';

import type { KeyboardButton } from '../DraggableKeyboard/components/DraggableKeyboardButton';

import type { FormData } from '.';

export interface StateData extends FormData {
  showURLInput: boolean;
  errors: Record<string, string>;
}

export interface StateActions {
  initialize: (button?: KeyboardButton) => void;

  setText: (text: Text) => void;
  setURL: (url: URL) => void;
  setStyle: (style: Style) => void;

  setShowURLInput: (show: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
}

export type State = StateData & StateActions;

function getData(button?: KeyboardButton): StateData {
  return {
    text: button?.text ?? defaultText,
    url: button?.url ?? defaultURL,
    style: button?.style ?? defaultStyle,

    showURLInput: Boolean(button?.url),
    errors: {},
  };
}

export const useKeyboardButtonPopoverStore = create<State>((set) => ({
  ...getData(),

  initialize: (button) => set(getData(button)),

  setText: (text) => set({ text }),
  setURL: (url) => set({ url }),
  setStyle: (style) => set({ style }),

  setShowURLInput: (show) => set({ showURLInput: show }),
  setErrors: (errors) => set({ errors }),
}));
