import { StateCreator } from 'zustand';

import {
	APIRequestBlockSliceActions as BaseAPIRequestBlockSliceActions,
	APIRequestBlockSliceState as BaseAPIRequestBlockSliceState,
	createAPIRequestBlockSlice as createBaseAPIRequestBlockSlice,
	initialAPIRequestBlockSliceState as initialBaseAPIRequestBlockSliceState,
} from '../../../APIRequestBlock/store';

export interface APIRequestBlockSliceState extends BaseAPIRequestBlockSliceState {
	showAPIRequestBlock: boolean;
}

export interface APIRequestBlockSliceActions extends BaseAPIRequestBlockSliceActions {
	setShowAPIRequestBlock: (show: boolean) => void;
}

export type APIRequestBlockSlice = APIRequestBlockSliceState &
	APIRequestBlockSliceActions;

export const initialAPIRequestBlockSliceState: APIRequestBlockSliceState = {
	...initialBaseAPIRequestBlockSliceState,

	showAPIRequestBlock: false,
};

export const createAPIRequestBlockSlice: StateCreator<APIRequestBlockSlice, [], []> = (
	set,
	get,
	api,
) => ({
	...initialAPIRequestBlockSliceState,
	...createBaseAPIRequestBlockSlice(set, get, api),

	setShowAPIRequestBlock: (show) => set({ showAPIRequestBlock: show }),
});
