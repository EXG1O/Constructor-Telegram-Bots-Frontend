import { create } from 'zustand';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

export interface StateParams {
  invoiceID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;

  usedStorageSize: number;
}

export interface StateActions {
  showOffcanvas: (invoiceID?: number) => void;
  hideOffcanvas: () => void;

  getRemainingStorageSize: () => number;

  setLoading: (loading: boolean) => void;
  setUsedStorageSize: (size: ((prev: number) => number) | number) => void;
}

export type State = StateParams & StateActions;

export const useInvoiceOffcanvasStore = create<State>()((set, get) => ({
  invoiceID: null,

  action: 'add',
  show: false,
  loading: false,

  usedStorageSize: 0,

  showOffcanvas: (invoiceID) =>
    set({
      invoiceID,
      action: invoiceID ? 'edit' : 'add',
      show: true,
      loading: Boolean(invoiceID),
    }),
  hideOffcanvas: () => set({ invoiceID: null, show: false }),

  getRemainingStorageSize: () =>
    useTelegramBotStore.getState().telegramBot!.storage_size - get().usedStorageSize,

  setLoading: (loading) => set({ loading }),
  setUsedStorageSize: (size) =>
    set({
      usedStorageSize: typeof size === 'function' ? size(get().usedStorageSize) : size,
    }),
}));
