import { create } from 'zustand';

import {
  createImagesBlockSlice,
  ImagesBlockSlice,
} from './components/ImagesBlock/store';
import {
  createKeyboardButtonBlockSlice,
  KeyboardButtonBlockSlice,
} from './components/KeyboardBlock/components/KeyboardButtonBlock/store';

export interface StateParams {
  messageID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (messageID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams &
  StateActions &
  ImagesBlockSlice &
  KeyboardButtonBlockSlice;

export const useMessageOffcanvasStore = create<State>((set, get, api) => ({
  messageID: null,

  action: 'add',
  show: false,
  loading: false,

  ...createImagesBlockSlice(set, get, api),
  ...createKeyboardButtonBlockSlice(set, get, api),

  showOffcanvas: (messageID) =>
    set({
      messageID: messageID,
      action: messageID ? 'edit' : 'add',
      show: true,
      loading: Boolean(messageID),
    }),
  hideOffcanvas: () => {
    const { keyboardButtonBlock } = get();
    keyboardButtonBlock.hideBlock();
    set({ messageID: null, show: false });
  },

  setLoading: (loading) => set({ loading }),
}));
