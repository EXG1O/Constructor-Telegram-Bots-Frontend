import { create } from 'zustand';

export interface StateParams {
  id: number | null;
  action: 'add' | 'edit';
  show: boolean;
}

export interface StateActions {
  showOffcanvas: (id?: number) => void;
  hideOffcanvas: () => void;
}

export type State = StateParams & StateActions;

export const useBackgroundTaskOffcanvasStore = create<State>()((set) => ({
  id: null,
  action: 'add',
  show: false,

  showOffcanvas: (id) =>
    set({ id: id ?? null, action: id ? 'edit' : 'add', show: true }),
  hideOffcanvas: () => set({ id: null, show: false }),
}));
