import { StateCreator } from 'zustand';

import { Message, defaultMessage } from '.';

export interface MessageBlockSliceState {
	message: Message;
}

export interface MessageBlockSliceActions {
	setMessage: (message: Message) => void;
}

export type MessageBlockSlice = MessageBlockSliceState & MessageBlockSliceActions;

export const initialMessageBlockSliceState: MessageBlockSliceState = {
	message: defaultMessage,
};

export const createMessageBlockSlice: StateCreator<MessageBlockSlice, [], []> = (
	set,
) => ({
	...initialMessageBlockSliceState,

	setMessage: (message) => set({ message }),
});
