import { create } from 'zustand';

export interface StateParams {
  operationID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (operationID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useDatabaseOperationOffcanvasStore = create<State>()((set) => ({
  operationID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (operationID) =>
    set({
      operationID,
      action: operationID ? 'edit' : 'add',
      show: true,
      loading: Boolean(operationID),
    }),
  hideOffcanvas: () => set({ operationID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
