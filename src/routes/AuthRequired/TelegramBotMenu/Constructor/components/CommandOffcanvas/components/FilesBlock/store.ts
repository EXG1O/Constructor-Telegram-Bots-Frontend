import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { defaultFiles, Files } from '.';

export interface FilesBlockSliceState {
	files: Files;

	showFilesBlock: boolean;
}

export interface FilesBlockSliceActions {
	updateFiles: (updater: (files: Files) => void) => void;

	setShowFilesBlock: (show: boolean) => void;
}

export type FilesBlockSlice = FilesBlockSliceState & FilesBlockSliceActions;

export const initialFilesBlockSliceState: FilesBlockSliceState = {
	files: defaultFiles,

	showFilesBlock: false,
};

export const createFilesBlockSlice: StateCreator<
	FilesBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set) => ({
	...initialFilesBlockSliceState,

	updateFiles: (updater) => set((state) => updater(state.files)),

	setShowFilesBlock: (show) => set({ showFilesBlock: show }),
}));
