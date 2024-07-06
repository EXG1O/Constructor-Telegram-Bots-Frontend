import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { defaultImages, Images } from '.';

export interface ImagesBlockSliceState {
	images: Images;

	showImagesBlock: boolean;
	imagesLoading: boolean;
}

export interface ImagesBlockSliceActions {
	updateImages: (updater: (images: Images) => void) => void;

	setShowImagesBlock: (show: boolean) => void;
	setImagesLoading: (loading: boolean) => void;
}

export type ImagesBlockSlice = ImagesBlockSliceState & ImagesBlockSliceActions;

export const initialImagesBlockSliceState: ImagesBlockSliceState = {
	images: defaultImages,

	showImagesBlock: false,
	imagesLoading: false,
};

export const createImagesBlockSlice: StateCreator<
	ImagesBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set) => ({
	...initialImagesBlockSliceState,

	updateImages: (updater) => set((state) => updater(state.images)),

	setShowImagesBlock: (show) =>
		set((state) => {
			state.showImagesBlock = show;
		}),
	setImagesLoading: (loading) =>
		set((state) => {
			state.imagesLoading = loading;
		}),
}));
