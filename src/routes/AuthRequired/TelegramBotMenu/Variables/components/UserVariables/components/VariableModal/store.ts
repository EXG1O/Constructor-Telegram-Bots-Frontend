import { create } from 'zustand';

export interface StateParams {
	variableID: number | null;

	show: boolean;
	loading: boolean;
}

export interface StateActions {
	showModal: (variableID?: number) => void;
	hideModal: () => void;

	setLoading: (loading: StateParams['loading']) => void;
}

export type State = StateParams & StateActions;

export type InitialState = Omit<StateParams, 'onAdd' | 'onSave'>;

const initialState: InitialState = { variableID: null, show: false, loading: false };

export const useVariableModalStore = create<State>((set) => ({
	...initialState,

	showModal: (variableID) =>
		set({ variableID, show: true, loading: Boolean(variableID) }),
	hideModal: () => set({ variableID: null, show: false, loading: false }),

	setLoading: (loading) => set({ loading }),
}));
