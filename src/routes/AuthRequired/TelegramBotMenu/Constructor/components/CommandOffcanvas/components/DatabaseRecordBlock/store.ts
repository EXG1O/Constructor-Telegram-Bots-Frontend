import { StateCreator } from 'zustand';

import { DatabaseRecord, defaultDatabaseRecord } from '.';

export interface DatabaseRecordBlockSliceState {
	databaseRecord: DatabaseRecord;

	showDatabaseRecordBlock: boolean;
}

export interface DatabaseRecordBlockSliceActions {
	setDatabaseRecord: (databaseRecord: DatabaseRecord) => void;

	setShowDatabaseRecordBlock: (show: boolean) => void;
}

export type DatabaseRecordBlockSlice = DatabaseRecordBlockSliceState &
	DatabaseRecordBlockSliceActions;

export const initialDatabaseRecordBlockSliceState: DatabaseRecordBlockSliceState = {
	databaseRecord: defaultDatabaseRecord,

	showDatabaseRecordBlock: false,
};

export const createDatabaseRecordBlockSlice: StateCreator<
	DatabaseRecordBlockSlice,
	[],
	[]
> = (set) => ({
	...initialDatabaseRecordBlockSliceState,

	setDatabaseRecord: (databaseRecord) => set({ databaseRecord }),

	setShowDatabaseRecordBlock: (show) => set({ showDatabaseRecordBlock: show }),
});
