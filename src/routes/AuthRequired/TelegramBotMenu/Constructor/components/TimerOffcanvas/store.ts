import { create } from 'zustand';

export interface StateParams {
  timerID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (timerID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useTimerOffcanvasStore = create<State>()((set) => ({
  timerID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (timerID) =>
    set({
      timerID,
      action: timerID ? 'edit' : 'add',
      show: true,
      loading: Boolean(timerID),
    }),
  hideOffcanvas: () => set({ timerID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
