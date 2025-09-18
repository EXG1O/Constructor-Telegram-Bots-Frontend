import { create } from 'zustand';

export interface StateParams {
  requestID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (requestID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useAPIRequestOffcanvasStore = create<State>()((set) => ({
  requestID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (requestID) =>
    set({
      requestID,
      action: requestID ? 'edit' : 'add',
      show: true,
      loading: Boolean(requestID),
    }),
  hideOffcanvas: () => set({ requestID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
