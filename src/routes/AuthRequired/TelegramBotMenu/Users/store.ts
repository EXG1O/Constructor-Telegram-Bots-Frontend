import i18n from 'i18n';
import { TOptions } from 'i18next';
import { create } from 'zustand';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ToastContainer';

import { UsersAPI } from 'services/api/telegram_bots/main';
import { TelegramBot, User } from 'services/api/telegram_bots/types';

import { Type } from './loader';

export interface StateParams {
	telegramBot: TelegramBot;

	loading: boolean;

	count: number;
	limit: number;
	offset: number;
	search: string | null;
	type: Type;

	users: User[];
}

export interface StateActions {
	updateUsers: (
		limit?: StateParams['limit'],
		offset?: StateParams['offset'],
		search?: StateParams['search'],
		type?: StateParams['type'],
	) => Promise<void>;

	setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<
	StateParams,
	'telegramBot' | 'count' | 'limit' | 'offset' | 'search' | 'type' | 'users'
>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

const langOptions: TOptions = { ns: RouteID.TelegramBotMenuUsers };

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = { loading: false };

	return create<State>((set, get) => ({
		...initialState,
		...initialProps,

		updateUsers: async (newLimit, newOffset, newSearch, newType) => {
			set({ loading: true });

			const {
				telegramBot,
				limit: currentLimit,
				offset: currentOffset,
				search: currentSearch,
				type: currentType,
			} = get();

			const limit = newLimit ?? currentLimit;
			const offset = newOffset ?? currentOffset;
			const search = newSearch ?? currentSearch;
			const type = newType ?? currentType;

			let filter: Parameters<typeof UsersAPI.get>[4] = undefined;

			if (type === 'allowed') {
				filter = 'is_allowed';
			} else if (type === 'blocked') {
				filter = 'is_blocked';
			}

			const response = await UsersAPI.get(
				telegramBot.id,
				limit,
				offset,
				search ?? undefined,
				filter,
			);

			if (!response.ok) {
				createMessageToast({
					message: i18n.t('messages.getUsers.error', langOptions),
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
				type,

				users: response.json.results,
			});
		},

		setLoading: (loading) => set({ loading }),
	}));
}
