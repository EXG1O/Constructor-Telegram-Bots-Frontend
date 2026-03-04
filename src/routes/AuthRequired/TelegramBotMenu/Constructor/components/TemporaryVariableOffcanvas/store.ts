import { create } from 'zustand';

export interface StateData {
  variableID: number | null;

  action: 'add' | 'edit';
  show: boolean;
  loading: boolean;
}

export interface StateActions {
  showOffcanvas: (variableID?: StateData['variableID']) => void;
  hideOffcanvas: () => void;

  setLoading: (loading: StateData['loading']) => void;
}

export type State = StateData & StateActions;

export const useTemporaryVariableOffcanvasStore = create<State>()((set, _get, api) => ({
  variableID: null,

  action: 'add',
  show: false,
  loading: false,

  showOffcanvas: (variableID) =>
    set({
      ...api.getInitialState(),
      variableID,
      action: variableID ? 'edit' : 'add',
      show: true,
      loading: Boolean(variableID),
    }),
  hideOffcanvas: () => set({ variableID: null, show: false }),

  setLoading: (loading) => set({ loading }),
}));
