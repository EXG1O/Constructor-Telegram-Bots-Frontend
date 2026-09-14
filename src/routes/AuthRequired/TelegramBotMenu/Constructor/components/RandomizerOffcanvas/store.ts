import { create } from 'zustand';

export interface StateParams {
  randomizerID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (randomizerID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useRandomizerOffcanvasStore = create<State>()((set) => ({
  randomizerID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (randomizerID) =>
    set({
      randomizerID,
      action: randomizerID ? 'edit' : 'add',
      show: true,
      loading: Boolean(randomizerID),
    }),
  hideOffcanvas: () => set({ randomizerID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
