import { StateCreator } from 'zustand';

import {
	APIRequestBlockSliceState as BaseAPIRequestBlockSliceState,
	APIRequestBlockSliceActions as BaseAPIRequestBlockSliceActions,
	initialAPIRequestBlockSliceState as initialBaseAPIRequestBlockSliceState,
	createAPIRequestBlockSlice as createBaseAPIRequestBlockSlice,
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
