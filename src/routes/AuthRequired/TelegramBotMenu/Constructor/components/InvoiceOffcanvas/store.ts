import { create } from 'zustand';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

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

export type State = StateParams & StateActions;

export const useInvoiceOffcanvasStore = create<State>()((set, get) => ({
  id: null,
  action: 'add',
  show: false,
  usedStorageSize: 0,

  showOffcanvas: (id) =>
    set({ id: id ?? null, action: id ? 'edit' : 'add', show: true }),
  hideOffcanvas: () => set({ id: null, show: false }),

  getRemainingStorageSize: () =>
    useTelegramBotStore.getState().telegramBot!.storage_size - get().usedStorageSize,

  setUsedStorageSize: (size) =>
    set({
      usedStorageSize: typeof size === 'function' ? size(get().usedStorageSize) : size,
    }),
}));
