import { KeyboardButton, defaultKeyboardButton } from '.';

export interface KeyboardButtonBlockSliceState {
	keyboardButtonBlockType: 'add' | 'edit';

	keyboardRowIndex: number | null;
	keyboardButtonIndex: number | null;

	keyboardButton: KeyboardButton;

	showKeyboardButtonBlock: boolean;
	showKeyboardButtonURLInput: boolean;
}

export interface KeyboardButtonBlockSliceActions {
	showAddKeyboardButtonBlock: () => void;
	showEditKeyboardButtonBlock: (rowIndex: number, buttonIndex: number) => void;

	hideKeyboardButtonBlock: () => void;

	addKeyboardButton: () => void;
	saveKeyboardButton: () => void;
	deleteKeyboardButton: () => void;

	updateKeyboardButton: (updater: (keyboardButton: KeyboardButton) => void) => void;

	setShowKeyboardButtonBlock: (show: boolean) => void;
	setShowKeyboardButtonURLInput: (show: boolean) => void;
}

export const initialKeyboardButtonBlockSliceState: KeyboardButtonBlockSliceState = {
	keyboardButtonBlockType: 'add',

	keyboardRowIndex: null,
	keyboardButtonIndex: null,

	keyboardButton: defaultKeyboardButton,

	showKeyboardButtonBlock: false,
	showKeyboardButtonURLInput: false,
};
