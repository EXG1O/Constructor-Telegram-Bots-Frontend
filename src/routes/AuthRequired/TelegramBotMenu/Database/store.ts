import { create } from 'zustand';

import { createMessageToast } from 'components/ToastContainer';

import { DatabaseRecordsAPI } from 'services/api/telegram_bots/main';
import { DatabaseRecord, TelegramBot } from 'services/api/telegram_bots/types';

export interface StateParams {
	telegramBot: TelegramBot;

	loading: boolean;

	count: number;
	limit: number;
	offset: number;
	search: string | null;

	records: DatabaseRecord[];
}

export interface StateActions {
	updateRecords: (
		limit?: StateParams['limit'],
		offset?: StateParams['offset'],
		search?: StateParams['search'],
	) => Promise<void>;

	setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<
	StateParams,
	'telegramBot' | 'count' | 'limit' | 'offset' | 'search' | 'records'
>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = { loading: false };

	return create<State>((set, get) => ({
		...initialState,
		...initialProps,

		updateRecords: async (newLimit, newOffset, newSearch) => {
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

			const response = await DatabaseRecordsAPI.get(
				telegramBot.id,
				limit,
				offset,
				search ?? undefined,
			);

			if (!response.ok) {
				createMessageToast({
					message: gettext('Не удалось получить записи базы данных.'),
					level: 'error',
				});
				set({ loading: false });
				return;
			}

			const { count, results } = response.json;

			set({ loading: false, count, limit, offset, search, records: results });
		},

		setLoading: (loading) => set({ loading }),
	}));
}
