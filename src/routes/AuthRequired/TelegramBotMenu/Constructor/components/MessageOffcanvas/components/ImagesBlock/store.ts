import { StateCreator } from 'zustand';

export interface ImagesBlockSliceState {
  imagesLoading: boolean;
}

export interface ImagesBlockSliceActions {
  setImagesLoading: (loading: boolean) => void;
}

export type ImagesBlockSlice = ImagesBlockSliceState & ImagesBlockSliceActions;

export const initialImagesBlockSliceState: ImagesBlockSliceState = {
  imagesLoading: false,
};

export const createImagesBlockSlice: StateCreator<ImagesBlockSlice, [], []> = (
  set,
) => ({
  ...initialImagesBlockSliceState,

  setImagesLoading: (loading) => set({ imagesLoading: loading }),
});
