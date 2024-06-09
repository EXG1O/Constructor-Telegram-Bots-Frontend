import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import {
	NameBlockSliceState,
	NameBlockSlice,
	initialNameBlockSliceState,
	createNameBlockSlice,
} from '../NameBlock/store';
import {
	SettingsBlockSliceState,
	SettingsBlockSlice,
	initialSettingsBlockSliceState,
	createSettingsBlockSlice,
} from './components/SettingsBlock/store';
import { defaultTrigger, defaultTriggerDescription } from './components/TriggerBlock';
import {
	TriggerBlockSliceState,
	TriggerBlockSlice,
	initialTriggerBlockSliceState,
	createTriggerBlockSlice,
} from './components/TriggerBlock/store';
import { Image, defaultImages } from './components/ImagesBlock';
import {
	ImagesBlockSliceState,
	ImagesBlockSlice,
	initialImagesBlockSliceState,
	createImagesBlockSlice,
} from './components/ImagesBlock/store';
import { _File, defaultFiles } from './components/FilesBlock';
import {
	FilesBlockSliceState,
	FilesBlockSlice,
	initialFilesBlockSliceState,
	createFilesBlockSlice,
} from './components/FilesBlock/store';
import {
	MessageBlockSliceState,
	MessageBlockSlice,
	initialMessageBlockSliceState,
	createMessageBlockSlice,
} from './components/MessageBlock/store';
import { defaultKeyboard } from './components/KeyboardBlock';
import { KeyboardRow } from './components/KeyboardBlock/components/Keyboard';
import {
	KeyboardBlockSliceState,
	KeyboardBlockSlice,
	initialKeyboardBlockSliceState,
	createKeyboardBlockSlice,
} from './components/KeyboardBlock/store';
import {
	defaultAPIRequest,
	defaultAPIRequestHeaders,
	defaultAPIRequestBody,
} from './components/APIRequestBlock';
import {
	APIRequestBlockSliceState,
	APIRequestBlockSlice,
	initialAPIRequestBlockSliceState,
	createAPIRequestBlockSlice,
} from './components/APIRequestBlock/store';
import { defaultDatabaseRecord } from './components/DatabaseRecordBlock';
import {
	DatabaseRecordBlockSliceState,
	DatabaseRecordBlockSlice,
	initialDatabaseRecordBlockSliceState,
	createDatabaseRecordBlockSlice,
} from './components/DatabaseRecordBlock/store';

import { ToastContextProps } from 'services/contexts/ToastContext';

import {
	CommandsAPI,
	CommandAPI,
	DiagramCommandAPI,
} from 'services/api/telegram_bots/main';
import { TelegramBot, DiagramCommand, Data } from 'services/api/telegram_bots/types';

export interface StateParams {
	telegramBot: TelegramBot;
	commandID: number | null;

	type: 'add' | 'edit';
	show: boolean;
	loading: boolean;

	createMessageToast: ToastContextProps['createMessageToast'];

	onAdd: (diagramCommand: DiagramCommand) => void;
	onSave: (commandID: number, diagramCommand: DiagramCommand) => void;
}

export interface StateActions {
	showAdd: () => void;
	showEdit: (commandID: number) => Promise<void>;
	hide: () => void;

	add: () => Promise<void>;
	save: () => Promise<void>;
}

export type State = StateParams &
	StateActions &
	NameBlockSlice &
	SettingsBlockSlice &
	TriggerBlockSlice &
	ImagesBlockSlice &
	FilesBlockSlice &
	MessageBlockSlice &
	KeyboardBlockSlice &
	APIRequestBlockSlice &
	DatabaseRecordBlockSlice;

export type InitialProps = Pick<
	StateParams,
	'telegramBot' | 'createMessageToast' | 'onAdd' | 'onSave'
>;
export type InitialState = Omit<StateParams, keyof InitialProps> &
	NameBlockSliceState &
	SettingsBlockSliceState &
	TriggerBlockSliceState &
	ImagesBlockSliceState &
	FilesBlockSliceState &
	MessageBlockSliceState &
	KeyboardBlockSliceState &
	APIRequestBlockSliceState &
	DatabaseRecordBlockSliceState;

export function createStore(initialProps: InitialProps) {
	const initialState: InitialState = {
		...initialNameBlockSliceState,
		...initialSettingsBlockSliceState,
		...initialTriggerBlockSliceState,
		...initialImagesBlockSliceState,
		...initialFilesBlockSliceState,
		...initialMessageBlockSliceState,
		...initialKeyboardBlockSliceState,
		...initialAPIRequestBlockSliceState,
		...initialDatabaseRecordBlockSliceState,

		commandID: null,

		type: 'add',
		show: false,
		loading: false,
	};

	return create<State>()(
		immer((set, get, api) => ({
			...initialState,
			...initialProps,

			...createNameBlockSlice(set, get, api),
			...createSettingsBlockSlice(set, get, api),
			...createTriggerBlockSlice(set, get, api),
			...createImagesBlockSlice(set, get, api),
			...createFilesBlockSlice(set, get, api),
			...createMessageBlockSlice(set, get, api),
			...createKeyboardBlockSlice(set, get, api),
			...createAPIRequestBlockSlice(set, get, api),
			...createDatabaseRecordBlockSlice(set, get, api),

			showAdd: () => set({ ...initialState, show: true }),
			showEdit: async (commandID) => {
				set({ ...initialState, type: 'edit', show: true, loading: true });

				const { telegramBot, createMessageToast } = get();

				const response = await CommandAPI.get(telegramBot.id, commandID);

				if (response.ok) {
					const {
						name,
						settings,
						images,
						files,
						trigger,
						message,
						keyboard,
						api_request,
						database_record,
					} = response.json;

					set({
						commandID,

						loading: false,

						name,
						settings: {
							isReplyToUserMessage: settings.is_reply_to_user_message,
							isDeleteUserMessage: settings.is_delete_user_message,
							isSendAsNewMessage: settings.is_send_as_new_message,
						},
						trigger: trigger
							? {
									...trigger,
									description:
										trigger.description ??
										defaultTriggerDescription,
								}
							: defaultTrigger,
						images: images.length
							? images
									.sort((a, b) => a.position - b.position)
									.map<Image>(
										({ id, name, size, url, from_url }) => ({
											id,
											key: crypto.randomUUID(),
											image: null,
											name: name ?? from_url!,
											size: size ?? 0,
											url: url ?? from_url!,
											fromURL: from_url,
										}),
									)
							: defaultImages,
						files: files.length
							? files
									.sort((a, b) => a.position - b.position)
									.map<_File>(
										({ id, name, size, url, from_url }) => ({
											id,
											key: crypto.randomUUID(),
											file: null,
											name: name ?? from_url!,
											size: size ?? 0,
											url: url ?? from_url!,
											fromURL: from_url,
										}),
									)
							: defaultFiles,
						message: message.text,
						keyboard: keyboard
							? {
									type: keyboard.type,
									rows: keyboard.buttons.reduce<KeyboardRow[]>(
										(
											rows,
											{
												id,
												row: rowIndex,
												position: buttonIndex,
												text,
												url,
											},
										) => {
											if (!rows[rowIndex]) {
												rows[rowIndex] = {
													draggableId: crypto.randomUUID(),
													buttons: [],
												};
											}

											rows[rowIndex].buttons[buttonIndex] = {
												id,
												draggableId: crypto.randomUUID(),
												text,
												url,
											};

											return rows;
										},
										[],
									),
								}
							: defaultKeyboard,
						apiRequest: api_request
							? {
									...api_request,
									headers: api_request.headers
										? api_request.headers.map((header) => {
												const [[key, value]] =
													Object.entries(header);
												return { key, value };
											})
										: defaultAPIRequestHeaders,
									body: api_request.body
										? JSON.stringify(api_request.body, undefined, 4)
										: defaultAPIRequestBody,
								}
							: defaultAPIRequest,
						databaseRecord: database_record
							? JSON.stringify(database_record.data, undefined, 4)
							: defaultDatabaseRecord,

						showTriggerBlock: Boolean(trigger),
						showTriggerDescriptionInput: Boolean(trigger?.description),
						showImagesBlock: Boolean(images.length),
						showFilesBlock: Boolean(files.length),
						showKeyboardBlock: Boolean(keyboard),
						showAPIRequestBlock: Boolean(api_request),
						showAPIRequestHeadersBlock: Boolean(
							api_request?.headers?.length,
						),
						showAPIRequestBodyBlock: Boolean(api_request?.body),
						showDatabaseRecordBlock: Boolean(database_record),
					});
				} else {
					createMessageToast({
						message: gettext('Не удалось получить данные команды.'),
						level: 'error',
					});
				}
			},
			hide: () => set({ show: false }),

			add: async () => {
				set({ loading: true });

				const {
					telegramBot,

					name,
					settings,
					images,
					files,
					trigger,
					message,
					keyboard,
					apiRequest,
					databaseRecord,

					showTriggerBlock,
					showTriggerDescriptionInput,
					showImagesBlock,
					showFilesBlock,
					showKeyboardBlock,
					showAPIRequestBlock,
					showAPIRequestHeadersBlock,
					showAPIRequestBodyBlock,
					showDatabaseRecordBlock,

					createMessageToast,
					onAdd,
				} = get();

				const commandResponse = await CommandsAPI.create(telegramBot.id, {
					name,
					settings: {
						is_reply_to_user_message: settings.isReplyToUserMessage,
						is_delete_user_message: settings.isDeleteUserMessage,
						is_send_as_new_message: settings.isSendAsNewMessage,
					},
					trigger: showTriggerBlock
						? {
								...trigger,
								description: showTriggerDescriptionInput
									? trigger.description
									: undefined,
							}
						: undefined,
					images: showImagesBlock
						? images.map<Data.CommandsAPI.CreateCommandImage>(
								({ image, fromURL }, index) => ({
									position: index,
									image,
									from_url: fromURL,
								}),
							)
						: undefined,
					files: showFilesBlock
						? files.map<Data.CommandsAPI.CreateCommandFile>(
								({ file, fromURL }, index) => ({
									position: index,
									file,
									from_url: fromURL,
								}),
							)
						: undefined,
					message: { text: message },
					keyboard: showKeyboardBlock
						? {
								type: keyboard.type,
								buttons: keyboard.rows.reduce<
									Data.CommandsAPI.CreateCommandKeyboardButton[]
								>((buttons, row, rowIndex) => {
									buttons.push(
										...row.buttons.map(
											({ text, url }, buttonIndex) => ({
												row: rowIndex,
												position: buttonIndex,
												text,
												url,
											}),
										),
									);

									return buttons;
								}, []),
							}
						: undefined,
					api_request: showAPIRequestBlock
						? {
								...apiRequest,
								headers: showAPIRequestHeadersBlock
									? apiRequest.headers.map((header) => ({
											[header.key]: header.value,
										}))
									: undefined,
								body: showAPIRequestBodyBlock
									? JSON.parse(apiRequest.body)
									: undefined,
							}
						: undefined,
					database_record: showDatabaseRecordBlock
						? { data: JSON.parse(databaseRecord) }
						: undefined,
				});

				if (commandResponse.ok) {
					const diagramCommandResponse = await DiagramCommandAPI.get(
						telegramBot.id,
						commandResponse.json.id,
					);

					if (diagramCommandResponse.ok) {
						onAdd(diagramCommandResponse.json);

						set({ show: false });

						createMessageToast({
							message: gettext('Вы успешно добавили команду.'),
							level: 'success',
						});
						return;
					} else {
						createMessageToast({
							message: gettext(
								'Не удалось получить добавленную ранее команду.',
							),
							level: 'error',
						});
					}
				} else {
					createMessageToast({
						message: gettext('Не удалось добавить команду.'),
						level: 'error',
					});
				}

				set({ loading: false });
			},
			save: async () => {
				set({ loading: true });

				const {
					telegramBot,
					commandID,

					name,
					settings,
					images,
					files,
					trigger,
					message,
					keyboard,
					apiRequest,
					databaseRecord,

					showTriggerBlock,
					showImagesBlock,
					showFilesBlock,
					showKeyboardBlock,
					showAPIRequestBlock,
					showDatabaseRecordBlock,

					createMessageToast,
					onSave,
				} = get();

				if (!commandID) {
					throw Error(
						'You call the save action, but commandID state must not be null.',
					);
				}

				const commandResponse = await CommandAPI.update(
					telegramBot.id,
					commandID,
					{
						name,
						settings: {
							is_reply_to_user_message: settings.isReplyToUserMessage,
							is_delete_user_message: settings.isDeleteUserMessage,
							is_send_as_new_message: settings.isSendAsNewMessage,
						},
						trigger: showTriggerBlock ? trigger : null,
						images: showImagesBlock
							? images.map<Data.CommandAPI.UpdateCommandImage>(
									({ id, image, fromURL }, index) => ({
										id,
										position: index,
										image,
										from_url: fromURL,
									}),
								)
							: null,
						files: showFilesBlock
							? files.map<Data.CommandAPI.UpdateCommandFile>(
									({ id, file, fromURL }, index) => ({
										id,
										position: index,
										file,
										from_url: fromURL,
									}),
								)
							: null,
						message: { text: message },
						keyboard: showKeyboardBlock
							? {
									type: keyboard.type,
									buttons: keyboard.rows.reduce<
										Data.CommandAPI.UpdateCommandKeyboardButton[]
									>((buttons, row, rowIndex) => {
										buttons.push(
											...row.buttons.map(
												({ id, text, url }, buttonIndex) => ({
													id,
													row: rowIndex,
													position: buttonIndex,
													text,
													url,
												}),
											),
										);

										return buttons;
									}, []),
								}
							: null,
						api_request: showAPIRequestBlock
							? {
									...apiRequest,
									headers:
										apiRequest.headers &&
										apiRequest.headers.map((header) => ({
											[header.key]: header.value,
										})),
									body:
										apiRequest.body && JSON.parse(apiRequest.body),
								}
							: null,
						database_record: showDatabaseRecordBlock
							? { data: JSON.parse(databaseRecord) }
							: null,
					},
				);

				if (commandResponse.ok) {
					const diagramCommandResponse = await DiagramCommandAPI.get(
						telegramBot.id,
						commandID,
					);

					if (diagramCommandResponse.ok) {
						onSave(commandID, diagramCommandResponse.json);

						set({ show: false });

						createMessageToast({
							message: gettext('Вы успешно сохранили команду.'),
							level: 'success',
						});
						return;
					} else {
						createMessageToast({
							message: gettext(
								'Не удалось получить сохранённую ранее команду.',
							),
							level: 'error',
						});
					}
				} else {
					createMessageToast({
						message: gettext('Не удалось сохранить команду.'),
						level: 'error',
					});
				}

				set({ loading: false });
			},
		})),
	);
}
