import { StateCreator } from 'zustand';

import { Name, defaultName } from '.';

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
