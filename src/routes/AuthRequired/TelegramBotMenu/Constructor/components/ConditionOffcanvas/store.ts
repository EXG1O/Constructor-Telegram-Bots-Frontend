import { create } from 'zustand';

export interface StateParams {
  conditionID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (conditionID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useConditionOffcanvasStore = create<State>()((set) => ({
  conditionID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (conditionID) =>
    set({
      conditionID,
      action: conditionID ? 'edit' : 'add',
      show: true,
      loading: Boolean(conditionID),
    }),
  hideOffcanvas: () => set({ conditionID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
