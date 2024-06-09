import { StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { APIRequest, defaultAPIRequest } from '.';

export interface APIRequestBlockSliceState {
	apiRequest: APIRequest;

	showAPIRequestHeadersBlock: boolean;
	showAPIRequestBodyBlock: boolean;
}

export interface APIRequestBlockSliceActions {
	updateAPIRequest: (updater: (apiRequest: APIRequest) => void) => void;

	setShowAPIRequestHeadersBlock: (show: boolean) => void;
	setShowAPIRequestBodyBlock: (show: boolean) => void;
}

export type APIRequestBlockSlice = APIRequestBlockSliceState &
	APIRequestBlockSliceActions;

export const initialAPIRequestBlockSliceState: APIRequestBlockSliceState = {
	apiRequest: defaultAPIRequest,

	showAPIRequestHeadersBlock: false,
	showAPIRequestBodyBlock: false,
};

export const createAPIRequestBlockSlice: StateCreator<
	APIRequestBlockSlice,
	[],
	[['zustand/immer', never]]
> = immer((set) => ({
	...initialAPIRequestBlockSliceState,

	updateAPIRequest: (updater) => set((state) => updater(state.apiRequest)),

	setShowAPIRequestHeadersBlock: (show) =>
		set((state) => {
			state.showAPIRequestHeadersBlock = show;
		}),
	setShowAPIRequestBodyBlock: (show) =>
		set((state) => {
			state.showAPIRequestBodyBlock = show;
		}),
}));
