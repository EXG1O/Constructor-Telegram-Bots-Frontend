import { create } from 'zustand';

import {
	createImagesBlockSlice,
	ImagesBlockSlice,
} from './components/ImagesBlock/store';
import {
	createKeyboardButtonBlockSlice,
	KeyboardButtonBlockSlice,
} from './components/KeyboardBlock/components/KeyboardButtonBlock/store';

export interface StateParams {
	commandID: number | null;

	type: 'add' | 'edit';
	show: boolean;
	loading: boolean;
}

export interface StateActions {
	showOffcanvas: (commandID?: number) => void;
	hideOffcanvas: () => void;

	setLoading: (loading: boolean) => void;
}

export type State = StateParams &
	StateActions &
	ImagesBlockSlice &
	KeyboardButtonBlockSlice;

export const useCommandOffcanvasStore = create<State>((set, get, api) => ({
	commandID: null,

	type: 'add',
	show: false,
	loading: false,

	...createImagesBlockSlice(set, get, api),
	...createKeyboardButtonBlockSlice(set, get, api),

	showOffcanvas: (commandID) =>
		set({
			commandID,
			type: commandID ? 'edit' : 'add',
			show: true,
			loading: Boolean(commandID),
		}),
	hideOffcanvas: () => {
		const { keyboardButtonBlock } = get();
		keyboardButtonBlock.hideBlock();
		set({ commandID: null, show: false });
	},

	setLoading: (loading) => set({ loading }),
}));
