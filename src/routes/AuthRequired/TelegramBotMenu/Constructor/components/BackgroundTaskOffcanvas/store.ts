import { create } from 'zustand';

export interface StateParams {
  taskID: number | null;

  type: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (taskID?: number) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export const useBackgroundTaskOffcanvasStore = create<State>()((set) => ({
  taskID: null,

  type: 'add',
  show: false,
  loading: false,

  showOffcanvas: (taskID) =>
    set({
      taskID,
      type: taskID ? 'edit' : 'add',
      show: true,
      loading: Boolean(taskID),
    }),
  hideOffcanvas: () => set({ taskID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
