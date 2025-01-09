import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { defaultParts, Parts } from '.';

export interface PartsBlockSliceState {
	parts: Parts;
}

export interface PartsBlockSliceActions {
	updateParts: (updater: (parts: Parts) => void) => void;
}

export type PartsBlockSlice = PartsBlockSliceState & PartsBlockSliceActions;

export const initialPartsBlockSliceState: PartsBlockSliceState = {
	parts: defaultParts,
};

export const createPartsBlockSlice: StateCreator<
	PartsBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set) => ({
	...initialPartsBlockSliceState,

	updateParts: (updater) => set((state) => updater(state.parts)),
}));
