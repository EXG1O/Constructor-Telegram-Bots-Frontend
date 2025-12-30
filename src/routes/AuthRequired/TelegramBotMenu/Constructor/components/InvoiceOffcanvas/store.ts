import { create } from 'zustand';

export interface StateParams {
  invoiceID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (invoiceID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useInvoiceOffcanvasStore = create<State>()((set) => ({
  invoiceID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (invoiceID) =>
    set({
      invoiceID,
      action: invoiceID ? 'edit' : 'add',
      show: true,
      loading: Boolean(invoiceID),
    }),
  hideOffcanvas: () => set({ invoiceID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
