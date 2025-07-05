import { create } from 'zustand';

export interface StateParams {
  triggerID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (triggerID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useTriggerOffcanvasStore = create<State>()((set) => ({
  triggerID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (triggerID) =>
    set({
      triggerID,
      action: triggerID ? 'edit' : 'add',
      show: true,
      loading: Boolean(triggerID),
    }),
  hideOffcanvas: () => set({ triggerID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
