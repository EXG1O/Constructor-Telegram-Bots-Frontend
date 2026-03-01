import { create } from 'zustand';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import {
  createImagesBlockSlice,
  ImagesBlockSlice,
} from './components/ImagesBlock/store';

export interface StateParams {
  messageID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;

  usedStorageSize: number;
}

export interface StateActions {
  showOffcanvas: (messageID?: number) => void;
  hideOffcanvas: () => void;

  getRemainingStorageSize: () => number;

  setLoading: (loading: boolean) => void;
  setUsedStorageSize: (size: ((prev: number) => number) | number) => void;
}

export type State = StateParams & StateActions & ImagesBlockSlice;

export const useMessageOffcanvasStore = create<State>((set, get, api) => ({
  messageID: null,

  action: 'add',
  show: false,
  loading: false,

  usedStorageSize: 0,

  ...createImagesBlockSlice(set, get, api),

  showOffcanvas: (messageID) =>
    set({
      ...api.getInitialState(),
      messageID,
      action: messageID ? 'edit' : 'add',
      show: true,
      loading: Boolean(messageID),
    }),
  hideOffcanvas: () => set({ messageID: null, show: false }),

  getRemainingStorageSize: () =>
    useTelegramBotStore.getState().telegramBot!.storage_size - get().usedStorageSize,

  setLoading: (loading) => set({ loading }),
  setUsedStorageSize: (size) =>
    set({
      usedStorageSize: typeof size === 'function' ? size(get().usedStorageSize) : size,
    }),
}));
