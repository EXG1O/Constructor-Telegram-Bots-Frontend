import { create } from 'zustand';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import {
  createImagesBlockSlice,
  type ImagesBlockSlice,
} from './components/ImagesBlock/store';

export interface StateParams {
  id: number | null;
  action: 'add' | 'edit';
  show: boolean;
  usedStorageSize: number;
}

export interface StateActions {
  showOffcanvas: (id?: number) => void;
  hideOffcanvas: () => void;

  getRemainingStorageSize: () => number;

  setUsedStorageSize: (size: ((prev: number) => number) | number) => void;
}

export type State = StateParams & StateActions & ImagesBlockSlice;

export const useMessageOffcanvasStore = create<State>((set, get, api) => ({
  id: null,
  action: 'add',
  show: false,
  usedStorageSize: 0,

  ...createImagesBlockSlice(set, get, api),

  showOffcanvas: (id) =>
    set({
      ...api.getInitialState(),
      id: id ?? null,
      action: id ? 'edit' : 'add',
      show: true,
    }),
  hideOffcanvas: () => set({ id: null, show: false }),

  getRemainingStorageSize: () =>
    useTelegramBotStore.getState().telegramBot!.storage_size - get().usedStorageSize,

  setUsedStorageSize: (size) =>
    set({
      usedStorageSize: typeof size === 'function' ? size(get().usedStorageSize) : size,
    }),
}));
