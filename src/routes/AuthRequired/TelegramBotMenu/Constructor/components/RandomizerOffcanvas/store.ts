import { create } from 'zustand';

export interface StateParams {
  id: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (taskID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useRandomizerOffcanvasStore = create<State>()((set) => ({
  id: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (id) =>
    set({
      id,
      action: id ? 'edit' : 'add',
      show: true,
      loading: Boolean(id),
    }),
  hideOffcanvas: () => set({ id: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
