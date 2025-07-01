import { create } from 'zustand';

interface State {
  show: boolean;
  loading: boolean;
  title: string;
  text: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

interface Actions {
  setShow: (props: Omit<State, 'show' | 'loading'>) => void;
  setHide: () => void;
  setLoading: (loading: boolean) => void;
}

const initialState: State = {
  show: false,
  loading: false,
  title: 'Unknown',
  text: 'Unknown',
  onConfirm: null,
  onCancel: null,
};

export const useConfirmModalStore = create<State & Actions>((set) => ({
  ...initialState,

  setShow: (props) => set({ ...initialState, ...props, show: true }),
  setHide: () => set({ show: false }),
  setLoading: (loading) => set({ loading }),
}));
