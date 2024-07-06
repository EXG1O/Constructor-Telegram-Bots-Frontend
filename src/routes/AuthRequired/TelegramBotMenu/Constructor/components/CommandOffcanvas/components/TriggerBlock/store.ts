import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { defaultTrigger, Trigger } from '.';

export interface TriggerBlockSliceState {
	trigger: Trigger;

	showTriggerBlock: boolean;
	showTriggerDescriptionInput: boolean;
}

export interface TriggerBlockSliceActions {
	updateTrigger: (updater: (trigger: Trigger) => void) => void;

	setShowTriggerBlock: (show: boolean) => void;
	setShowTriggerDescriptionInput: (show: boolean) => void;
}

export type TriggerBlockSlice = TriggerBlockSliceState & TriggerBlockSliceActions;

export const initialTriggerBlockSliceState: TriggerBlockSliceState = {
	trigger: defaultTrigger,

	showTriggerBlock: false,
	showTriggerDescriptionInput: false,
};

export const createTriggerBlockSlice: StateCreator<
	TriggerBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set) => ({
	...initialTriggerBlockSliceState,

	updateTrigger: (updater) => set((state) => updater(state.trigger)),

	setShowTriggerBlock: (show) =>
		set((state) => {
			state.showTriggerBlock = show;
		}),
	setShowTriggerDescriptionInput: (show) =>
		set((state) => {
			state.showTriggerDescriptionInput = show;
		}),
}));
