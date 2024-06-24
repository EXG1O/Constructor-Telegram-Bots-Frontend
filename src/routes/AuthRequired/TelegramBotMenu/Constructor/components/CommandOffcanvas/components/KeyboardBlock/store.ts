import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
	KeyboardButtonBlockSliceState,
	KeyboardButtonBlockSliceActions,
	initialKeyboardButtonBlockSliceState,
} from './components/KeyboardButtonBlock/store';

import { Keyboard, defaultKeyboard } from '.';

export interface KeyboardBlockSliceState extends KeyboardButtonBlockSliceState {
	keyboard: Keyboard;

	showKeyboardBlock: boolean;
}

export interface KeyboardBlockSliceActions extends KeyboardButtonBlockSliceActions {
	updateKeyboard: (updater: (keyboard: Keyboard) => void) => void;

	deleteKeyboardRow: (index: number) => void;

	setShowKeyboardBlock: (show: boolean) => void;
}

export type KeyboardBlockSlice = KeyboardBlockSliceState & KeyboardBlockSliceActions;

export const initialKeyboardBlockSliceState: KeyboardBlockSliceState = {
	...initialKeyboardButtonBlockSliceState,

	keyboard: defaultKeyboard,

	showKeyboardBlock: false,
};

export const createKeyboardBlockSlice: StateCreator<
	KeyboardBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set, get) => ({
	...initialKeyboardBlockSliceState,

	showAddKeyboardButtonBlock: () =>
		set({ ...initialKeyboardButtonBlockSliceState, showKeyboardButtonBlock: true }),
	showEditKeyboardButtonBlock: (rowIndex, buttonIndex) => {
		set(initialKeyboardButtonBlockSliceState);
		set((state) => {
			state.keyboardButtonBlockType = 'edit';

			state.keyboardRowIndex = rowIndex;
			state.keyboardButtonIndex = buttonIndex;

			const button = state.keyboard.rows[rowIndex].buttons[buttonIndex];

			state.keyboardButton.text = button.text;

			if (button.url) {
				state.keyboardButton.url = button.url;
				state.showKeyboardButtonURLInput = true;
			}

			state.showKeyboardButtonBlock = true;
		});
	},

	hideKeyboardButtonBlock: () =>
		set({
			showKeyboardButtonBlock: false,
			keyboardRowIndex: null,
			keyboardButtonIndex: null,
		}),

	addKeyboardButton: () => {
		set((state) => {
			state.keyboard.rows.push({
				draggableId: crypto.randomUUID(),
				buttons: [
					{
						draggableId: crypto.randomUUID(),
						text: state.keyboardButton.text,
						url: state.showKeyboardButtonURLInput
							? state.keyboardButton.url
							: null,
					},
				],
			});
		});
		set(initialKeyboardButtonBlockSliceState);
	},
	saveKeyboardButton: () => {
		const { keyboardRowIndex, keyboardButtonIndex } = get();

		if (keyboardRowIndex === null) {
			throw Error(
				'You call the save action, but keyboardRowIndex ' +
					'state must not be null.',
			);
		}

		if (keyboardButtonIndex === null) {
			throw Error(
				'You call the save action, but keyboardButtonIndex ' +
					'state must not be null.',
			);
		}

		set((state) => {
			const button =
				state.keyboard.rows[keyboardRowIndex].buttons[keyboardButtonIndex];

			button.text = state.keyboardButton.text;
			button.url = state.showKeyboardButtonURLInput
				? state.keyboardButton.url
				: null;
		});
		set(initialKeyboardButtonBlockSliceState);
	},
	deleteKeyboardButton: () => {
		const { keyboardRowIndex, keyboardButtonIndex } = get();

		if (keyboardRowIndex === null) {
			throw Error(
				'You call the save action, but keyboardRowIndex ' +
					'state must not be null.',
			);
		}

		if (keyboardButtonIndex === null) {
			throw Error(
				'You call the save action, but keyboardButtonIndex ' +
					'state must not be null.',
			);
		}

		set((state) => {
			const buttons = state.keyboard.rows[keyboardRowIndex].buttons;

			if (buttons.length) {
				buttons.splice(keyboardButtonIndex, 1);
			} else {
				state.keyboard.rows.splice(keyboardRowIndex, 1);
			}
		});
		set(initialKeyboardButtonBlockSliceState);
	},

	updateKeyboard: (updater) => set((state) => updater(state.keyboard)),
	updateKeyboardButton: (updater) => set((state) => updater(state.keyboardButton)),

	deleteKeyboardRow: (index) =>
		set((state) => {
			state.keyboard.rows.splice(index, 1);
		}),

	setShowKeyboardBlock: (show) => set({ showKeyboardBlock: show }),
	setShowKeyboardButtonBlock: (show) => set({ showKeyboardBlock: show }),
	setShowKeyboardButtonURLInput: (show) => set({ showKeyboardButtonURLInput: show }),
}));
