import { create } from 'zustand';

import { createMessageToast } from 'components/ToastContainer';

import { defaultDescription, Description } from './components/DescriptionInput';
import { defaultName, Name } from './components/NameInput';
import { defaultValue, Value } from './components/ValueEditor';

import { VariableAPI, VariablesAPI } from 'services/api/telegram_bots/main';
import { TelegramBot, Variable } from 'services/api/telegram_bots/types';

export interface StateParams {
	telegramBot: TelegramBot;
	variableID: number | null;

	type: 'add' | 'edit';
	show: boolean;
	loading: boolean;

	name: Name;
	value: Value;
	description: Description;

	onAdd: (variable: Variable) => void;
	onSave: (variable: Variable) => void;
}

export interface StateActions {
	showAdd: () => void;
	showEdit: (variableID: number) => Promise<void>;
	hide: () => void;

	add: () => Promise<void>;
	save: () => Promise<void>;

	setName: (name: Name) => void;
	setValue: (value: Value) => void;
	setDescription: (description: Description) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<StateParams, 'telegramBot' | 'onAdd' | 'onSave'>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = {
		variableID: null,

		type: 'add',
		show: false,
		loading: false,

		name: defaultName,
		value: defaultValue,
		description: defaultDescription,
	};

	return create<State>((set, get) => ({
		...initialState,
		...initialProps,

		showAdd: () => set({ ...initialState, show: true }),
		showEdit: async (variableID) => {
			set({ ...initialState, type: 'edit', show: true, loading: true });

			const { telegramBot } = get();

			const response = await VariableAPI.get(telegramBot.id, variableID);

			if (!response.ok) {
				createMessageToast({
					message: gettext('Не удалось получить данные переменной.'),
					level: 'error',
				});
				set({ show: false });
				return;
			}

			const { id, ...variable } = response.json;

			set({ ...variable, variableID: id, loading: false });
		},
		hide: () => set({ show: false }),

		add: async () => {
			set({ loading: true });

			const { telegramBot, name, value, description, onAdd } = get();

			const response = await VariablesAPI.create(telegramBot.id, {
				name,
				value,
				description,
			});

			if (!response.ok) {
				createMessageToast({
					message: gettext('Не удалось добавить переменную.'),
					level: 'error',
				});
				set({ loading: false });
				return;
			}

			onAdd(response.json);
			createMessageToast({
				message: gettext('Вы успешно добавили переменную.'),
				level: 'success',
			});
			set({ show: false, loading: false });
		},
		save: async () => {
			set({ loading: true });

			const { telegramBot, variableID, name, value, description, onSave } = get();

			if (!variableID) {
				throw Error(
					'You call the save action, but variableID state must not be null.',
				);
			}

			const response = await VariableAPI.update(telegramBot.id, variableID, {
				name,
				value,
				description,
			});

			if (!response.ok) {
				createMessageToast({
					message: gettext('Не удалось сохранить переменную.'),
					level: 'error',
				});
				set({ loading: false });
				return;
			}

			onSave(response.json);
			createMessageToast({
				message: gettext('Вы успешно сохранили переменную.'),
				level: 'success',
			});
			set({ show: false, loading: false });
		},

		setName: (name) => set({ name }),
		setValue: (value) => set({ value }),
		setDescription: (description) => set({ description }),
	}));
}
