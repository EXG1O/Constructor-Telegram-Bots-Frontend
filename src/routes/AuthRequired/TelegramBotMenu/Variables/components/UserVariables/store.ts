import { create } from 'zustand';

import { createMessageToast } from 'components/ToastContainer';

import { VariablesAPI } from 'services/api/telegram_bots/main';
import { TelegramBot, Variable } from 'services/api/telegram_bots/types';

export interface StateParams {
	telegramBot: TelegramBot;

	loading: boolean;

	count: number;
	limit: number;
	offset: number;
	search: string | null;

	variables: Variable[];
}

export interface StateActions {
	updateVariables: (
		limit?: StateParams['limit'],
		offset?: StateParams['offset'],
		search?: StateParams['search'],
	) => Promise<void>;

	setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<
	StateParams,
	'telegramBot' | 'count' | 'limit' | 'offset' | 'variables'
>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = {
		loading: false,
		search: null,
	};

	return create<State>((set, get) => ({
		...initialState,
		...initialProps,

		updateVariables: async (newLimit, newOffset, newSearch) => {
			set({ loading: true });

			const {
				telegramBot,
				limit: currentLimit,
				offset: currentOffset,
				search: currentSearch,
			} = get();

			const limit = newLimit ?? currentLimit;
			const offset = newOffset ?? currentOffset;
			const search = newSearch ?? currentSearch;

			const response = await VariablesAPI.get(
				telegramBot.id,
				limit,
				offset,
				search ?? undefined,
			);

			if (!response.ok) {
				createMessageToast({
					message: gettext('Не удалось получить список переменных!'),
					level: 'error',
				});
				set({ loading: false });
				return;
			}

			set({
				loading: false,

				count: response.json.count,
				limit,
				offset,
				search,

				variables: response.json.results,
			});
		},

		setLoading: (loading) => set({ loading }),
	}));
}
