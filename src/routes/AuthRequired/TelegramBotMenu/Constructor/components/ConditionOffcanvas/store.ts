import i18n from 'i18n';
import { TOptions } from 'i18next';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ToastContainer';

import {
	createPartsBlockSlice,
	initialPartsBlockSliceState,
	PartsBlockSlice,
	PartsBlockSliceState,
} from './components/PartsBlock/store';

import {
	createNameBlockSlice,
	initialNameBlockSliceState,
	NameBlockSlice,
	NameBlockSliceState,
} from '../NameBlock/store';

import { ConditionAPI, ConditionsAPI } from 'services/api/telegram_bots/main';
import { Condition, TelegramBot } from 'services/api/telegram_bots/types';

export interface StateParams {
	telegramBot: TelegramBot;
	conditionID: number | null;

	type: 'add' | 'edit';
	show: boolean;
	loading: boolean;

	onAdd: (condition: Condition) => void;
	onSave: (condition: Condition) => void;
}

export interface StateActions {
	showAdd: () => void;
	showEdit: (conditionID: number) => Promise<void>;
	hide: () => void;

	add: () => Promise<void>;
	save: () => Promise<void>;
}

export type State = StateParams & StateActions & NameBlockSlice & PartsBlockSlice;

export type InitialProps = Pick<StateParams, 'telegramBot' | 'onAdd' | 'onSave'>;
export type InitialState = Omit<StateParams, keyof InitialProps> &
	NameBlockSliceState &
	PartsBlockSliceState;

const langOptions: TOptions = { ns: RouteID.TelegramBotMenuConstructor };

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = {
		...initialNameBlockSliceState,
		...initialPartsBlockSliceState,

		conditionID: null,

		type: 'add',
		show: false,
		loading: false,
	};

	return create<State>()(
		immer((set, get, api) => ({
			...initialState,
			...initialProps,

			...createNameBlockSlice(set, get, api),
			...createPartsBlockSlice(set, get, api),

			showAdd: () => set({ ...initialState, show: true }),
			showEdit: async (conditionID) => {
				set({ ...initialState, type: 'edit', show: true, loading: true });

				const { telegramBot } = get();

				const response = await ConditionAPI.get(telegramBot.id, conditionID);

				if (response.ok) {
					const { name } = response.json;

					set({
						conditionID,

						loading: false,

						name,
					});
				} else {
					createMessageToast({
						message: i18n.t('messages.getCondition.error', langOptions),
						level: 'error',
					});
				}
			},
			hide: () => set({ show: false }),

			add: async () => {
				set({ loading: true });

				const { telegramBot, name, parts, onAdd } = get();

				const response = await ConditionsAPI.create(telegramBot.id, {
					name,
					parts: parts.map(
						({
							id,
							firstValue,
							secondValue,
							nextPartOperator,
							...part
						}) => ({
							...part,
							type: '+',
							first_value: firstValue,
							second_value: secondValue,
							next_part_operator:
								nextPartOperator !== 'null' ? nextPartOperator : null,
						}),
					),
				});

				if (response.ok) {
					onAdd(response.json);

					set({ show: false });

					createMessageToast({
						message: i18n.t(
							'messages.createCondition.success',
							langOptions,
						),
						level: 'success',
					});
					return;
				} else {
					createMessageToast({
						message: i18n.t('messages.createCondition.error', langOptions),
						level: 'error',
					});
				}

				set({ loading: false });
			},
			save: async () => {
				set({ loading: true });

				const { telegramBot, conditionID, name, parts, onSave } = get();

				if (!conditionID) {
					throw Error(
						'You call the save action, but conditionID ' +
							'state must not be null.',
					);
				}

				const response = await ConditionAPI.update(
					telegramBot.id,
					conditionID,
					{
						name,
						parts: parts.map(
							({
								firstValue,
								secondValue,
								nextPartOperator,
								...part
							}) => ({
								...part,
								type: '+',
								first_value: firstValue,
								second_value: secondValue,
								next_part_operator:
									nextPartOperator !== 'null'
										? nextPartOperator
										: null,
							}),
						),
					},
				);

				if (response.ok) {
					onSave(response.json);

					set({ show: false });

					createMessageToast({
						message: i18n.t(
							'messages.updateCondition.success',
							langOptions,
						),
						level: 'success',
					});
					return;
				} else {
					createMessageToast({
						message: i18n.t('messages.updateCondition.error', langOptions),
						level: 'error',
					});
				}

				set({ loading: false });
			},
		})),
	);
}
