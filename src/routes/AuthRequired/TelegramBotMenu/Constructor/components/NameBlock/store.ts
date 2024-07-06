import { StateCreator } from 'zustand';

import { defaultName, Name } from '.';

export interface NameBlockSliceState {
	name: Name;
}

export interface NameBlockSliceActions {
	setName: (name: Name) => void;
}

export type NameBlockSlice = NameBlockSliceState & NameBlockSliceActions;

export const initialNameBlockSliceState: NameBlockSliceState = { name: defaultName };

export const createNameBlockSlice: StateCreator<NameBlockSlice, [], []> = (set) => ({
	...initialNameBlockSliceState,

	setName: (name) => set({ name }),
});
