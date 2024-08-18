import { create } from 'zustand';

import { createMessageToast } from 'components/ToastContainer';

import { Data, defaultData } from './components/DataEditor';

import { DatabaseRecordsAPI } from 'services/api/telegram_bots/main';
import { DatabaseRecord, TelegramBot } from 'services/api/telegram_bots/types';

export interface StateParams {
	telegramBot: TelegramBot;

	type: 'add';
	show: boolean;
	loading: boolean;

	data: Data;

	onAdd: (record: DatabaseRecord) => void;
}

export interface StateActions {
	showAdd: () => void;
	hide: () => void;

	add: () => Promise<void>;

	setData: (data: StateParams['data']) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<StateParams, 'telegramBot' | 'onAdd'>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = {
		type: 'add',
		show: false,
		loading: false,

		data: defaultData,
	};

	return create<State>((set, get) => ({
		...initialState,
		...initialProps,

		showAdd: () => set({ ...initialState, show: true }),
		hide: () => set({ show: false }),

		add: async () => {
			set({ loading: true });

			const { telegramBot, data: rawData, onAdd } = get();

			try {
				const data: Record<string, any> = JSON.parse(rawData);

				const response = await DatabaseRecordsAPI.create(telegramBot.id, {
					data,
				});

				if (!response.ok) {
					createMessageToast({
						message: gettext('Не удалось добавить запись.'),
						level: 'error',
					});
					set({ loading: false });
					return;
				}

				onAdd(response.json);
				createMessageToast({
					message: gettext('Вы успешно добавили запись.'),
					level: 'success',
				});
				set({ show: false, loading: false });
			} catch (error) {
				if (error instanceof SyntaxError) {
					createMessageToast({
						message: gettext('Введите правильно данные в формате JSON.'),
						level: 'error',
					});
				} else {
					createMessageToast({
						message: gettext('Произошла непредвиденная ошибка.'),
						level: 'error',
					});
				}
				return;
			}
		},

		setData: (data) => set({ data }),
	}));
}
