import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { Settings, defaultSettings } from '.';

export interface SettingsBlockSliceState {
	settings: Settings;
}

export interface SettingsBlockSliceActions {
	updateSettings: (updater: (settings: Settings) => void) => void;
}

export type SettingsBlockSlice = SettingsBlockSliceState & SettingsBlockSliceActions;

export const initialSettingsBlockSliceState: SettingsBlockSliceState = {
	settings: defaultSettings,
};

export const createSettingsBlockSlice: StateCreator<
	SettingsBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set) => ({
	...initialSettingsBlockSliceState,

	updateSettings: (updater) => set((state) => updater(state.settings)),
}));
