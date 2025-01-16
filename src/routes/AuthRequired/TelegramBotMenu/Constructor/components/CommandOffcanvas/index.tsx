import React, { ReactElement, useEffect, useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Formik, FormikHelpers, useFormikContext } from 'formik';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Button from 'components/Button';
import Offcanvas from 'components/Offcanvas';
import { createMessageToast } from 'components/ToastContainer';

import APIRequestBlock, { defaultAPIRequest } from './components/APIRequestBlock';
import { APIRequest } from './components/APIRequestBlock';
import DatabaseRecordBlock, {
	DatabaseRecord,
	defaultDatabaseRecord,
} from './components/DatabaseRecordBlock';
import FilesCard, { CustomFile, defaultFiles, Files } from './components/FilesBlock';
import ImagesBlock, { defaultImages, Image, Images } from './components/ImagesBlock';
import KeyboardBlock, { defaultKeyboard, Keyboard } from './components/KeyboardBlock';
import { KeyboardRow } from './components/KeyboardBlock/components/Keyboard';
import MessageBlock, { defaultMessage, Message } from './components/MessageBlock';
import SettingsBlock, { defaultSettings, Settings } from './components/SettingsBlock';
import TelegramBotStorage from './components/TelegramBotStorage';
import TriggerBlock, { defaultTrigger, Trigger } from './components/TriggerBlock';

import AddonButtonGroup from '../AddonButtonGroup';
import NameBlock, { defaultName, Name } from '../NameBlock';

import './index.scss';

import { CommandAPI, CommandsAPI } from 'api/telegram_bots/main';
import { Command, Data } from 'api/telegram_bots/types';

import { useCommandOffcanvasStore } from './store';

export interface FormValues {
	name: Name;
	settings: Settings;
	trigger: Trigger;
	images: Images;
	files: Files;
	message: Message;
	keyboard: Keyboard;
	api_request: APIRequest;
	database_record: DatabaseRecord;

	show_trigger_block: boolean;
	show_trigger_description_input: boolean;

	show_images_block: boolean;
	show_files_block: boolean;
	show_keyboard_block: boolean;

	show_api_request_block: boolean;
	show_api_request_headers_block: boolean;
	show_api_request_body_block: boolean;

	show_database_block: boolean;
}

export const defaultFormValues: FormValues = {
	name: defaultName,
	settings: defaultSettings,
	trigger: defaultTrigger,
	images: defaultImages,
	files: defaultFiles,
	message: defaultMessage,
	keyboard: defaultKeyboard,
	api_request: defaultAPIRequest,
	database_record: defaultDatabaseRecord,

	show_trigger_block: false,
	show_trigger_description_input: false,

	show_images_block: false,
	show_files_block: false,
	show_keyboard_block: false,

	show_api_request_block: false,
	show_api_request_headers_block: false,
	show_api_request_body_block: false,

	show_database_block: false,
};

function InnerCommandOffcanvas(): ReactElement {
	const formID = useId();

	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor);

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const { isSubmitting, setValues, resetForm } = useFormikContext<FormValues>();

	const commandID = useCommandOffcanvasStore((state) => state.commandID);
	const type = useCommandOffcanvasStore((state) => state.type);
	const show = useCommandOffcanvasStore((state) => state.show);
	const loading = useCommandOffcanvasStore((state) => state.loading);
	const hideOffcanvas = useCommandOffcanvasStore((state) => state.hideOffcanvas);
	const setLoading = useCommandOffcanvasStore((state) => state.setLoading);

	useEffect(() => {
		if (commandID) {
			(async () => {
				const response = await CommandAPI.get(telegramBot.id, commandID);

				if (!response.ok) {
					hideOffcanvas();
					createMessageToast({
						message: t('commandOffcanvas.messages.getCommand.error'),
						level: 'error',
					});
					return;
				}

				const {
					id,
					trigger,
					images,
					files,
					keyboard,
					api_request,
					database_record,
					...command
				} = response.json;

				setValues({
					...command,

					trigger: trigger
						? {
								...trigger,
								description:
									trigger.description ?? defaultTrigger.description,
							}
						: defaultTrigger,
					images: images.length
						? images
								.sort((a, b) => a.position - b.position)
								.map<Image>(({ id, name, size, url, from_url }) => ({
									id,
									key: crypto.randomUUID(),
									image: null,
									name: name ?? from_url!,
									size: size ?? 0,
									url: url ?? from_url!,
									from_url,
								}))
						: defaultImages,
					files: files.length
						? files
								.sort((a, b) => a.position - b.position)
								.map<CustomFile>(
									({ id, name, size, url, from_url }) => ({
										id,
										key: crypto.randomUUID(),
										file: null,
										name: name ?? from_url!,
										size: size ?? 0,
										url: url ?? from_url!,
										from_url,
									}),
								)
						: defaultFiles,
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
					api_request: api_request
						? {
								...api_request,
								headers: api_request.headers
									? api_request.headers.map((header) => {
											const [[key, value]] =
												Object.entries(header);
											return { key, value };
										})
									: defaultAPIRequest.headers,
								body: api_request.body
									? JSON.stringify(api_request.body, undefined, 4)
									: defaultAPIRequest.body,
							}
						: defaultAPIRequest,
					database_record: database_record
						? {
								...database_record,
								data: JSON.stringify(
									database_record.data,
									undefined,
									4,
								),
							}
						: defaultDatabaseRecord,

					show_trigger_block: Boolean(trigger),
					show_trigger_description_input: Boolean(trigger?.description),

					show_images_block: Boolean(images.length),
					show_files_block: Boolean(files.length),
					show_keyboard_block: Boolean(keyboard),

					show_api_request_block: Boolean(api_request),
					show_api_request_headers_block: Boolean(api_request?.headers),
					show_api_request_body_block: Boolean(api_request?.body),

					show_database_block: Boolean(database_record),
				});
				setLoading(false);
			})();
		}
	}, [commandID]);

	function handleExited(): void {
		resetForm();
	}

	return (
		<Offcanvas
			show={show}
			loading={isSubmitting || loading}
			className='command'
			onHide={hideOffcanvas}
			onExited={handleExited}
		>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>
					{t('commandOffcanvas.title', { context: type })}
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body as={Form} id={formID}>
				<NameBlock />
				<SettingsBlock />
				<TriggerBlock />
				<ImagesBlock />
				<FilesCard />
				<MessageBlock />
				<KeyboardBlock />
				<APIRequestBlock />
				<DatabaseRecordBlock />
			</Offcanvas.Body>
			<Offcanvas.Footer className='gap-2'>
				<TelegramBotStorage />
				<AddonButtonGroup>
					<AddonButtonGroup.Button name='show_trigger_block'>
						{t('commandOffcanvas.triggerBlock.title')}
					</AddonButtonGroup.Button>
					<AddonButtonGroup.Button name='show_images_block'>
						{t('commandOffcanvas.imagesBlock.title')}
					</AddonButtonGroup.Button>
					<AddonButtonGroup.Button name='show_files_block'>
						{t('commandOffcanvas.filesBlock.title')}
					</AddonButtonGroup.Button>
					<AddonButtonGroup.Button name='show_keyboard_block'>
						{t('commandOffcanvas.keyboardBlock.title')}
					</AddonButtonGroup.Button>
					<AddonButtonGroup.Button name='show_api_request_block'>
						{t('apiRequestBlock.title')}
					</AddonButtonGroup.Button>
					<AddonButtonGroup.Button name='show_database_block'>
						{t('commandOffcanvas.databaseRecordBlock.title')}
					</AddonButtonGroup.Button>
				</AddonButtonGroup>
				<Button type='submit' form={formID} variant='success'>
					{t('commandOffcanvas.actionButton', { context: type })}
				</Button>
			</Offcanvas.Footer>
		</Offcanvas>
	);
}

export interface CommandOffcanvasProps {
	onAdd?: (command: Command) => void;
	onSave?: (command: Command) => void;
}

function CommandOffcanvas({
	onAdd,
	onSave,
}: CommandOffcanvasProps): ReactElement<CommandOffcanvasProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas',
	});

	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const commandID = useCommandOffcanvasStore((state) => state.commandID);
	const type = useCommandOffcanvasStore((state) => state.type);
	const hideOffcanvas = useCommandOffcanvasStore((state) => state.hideOffcanvas);

	async function handleSubmit(
		{
			trigger,
			images,
			files,
			keyboard,
			api_request,
			database_record,
			show_trigger_block,
			show_trigger_description_input,
			show_images_block,
			show_files_block,
			show_keyboard_block,
			show_api_request_block,
			show_api_request_headers_block,
			show_api_request_body_block,
			show_database_block,
			...values
		}: FormValues,
		{ setFieldError }: FormikHelpers<FormValues>,
	): Promise<void> {
		let apiRequestBody: Record<string, any> | null = null;
		let databaseRecordData: Record<string, any> | null = null;

		if (show_api_request_body_block) {
			try {
				apiRequestBody = JSON.parse(api_request.body);
			} catch (error) {
				if (error instanceof SyntaxError) {
					setFieldError(
						'api_request.body',
						t('messages.validation.invalidJSON'),
					);
				}
				return;
			}
		}

		if (show_database_block) {
			try {
				databaseRecordData = JSON.parse(database_record.data);
			} catch (error) {
				if (error instanceof SyntaxError) {
					setFieldError(
						'database_record.data',
						t('messages.validation.invalidJSON'),
					);
				}
				return;
			}
		}

		const data: Data.CommandsAPI.Create | Data.CommandAPI.Update = {
			...values,
			trigger: show_trigger_block ? trigger : null,
			images:
				show_images_block && images.length
					? images.map<Data.CommandsAPI.CreateCommandImage>(
							({ image, from_url }, index) => ({
								position: index,
								image,
								from_url,
							}),
						)
					: null,
			files:
				show_files_block && files.length
					? files.map<Data.CommandsAPI.CreateCommandFile>(
							({ file, from_url }, index) => ({
								position: index,
								file,
								from_url,
							}),
						)
					: null,
			keyboard: show_keyboard_block
				? {
						type: keyboard.type,
						buttons: keyboard.rows.reduce<
							Data.CommandsAPI.CreateCommandKeyboardButton[]
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
			api_request: show_api_request_block
				? {
						...api_request,
						headers: show_api_request_headers_block
							? api_request.headers.map((header) => ({
									[header.key]: header.value,
								}))
							: null,
						body: apiRequestBody,
					}
				: null,
			database_record: databaseRecordData ? { data: databaseRecordData } : null,
		};

		const response = await (type === 'add'
			? CommandsAPI.create(telegramBot.id, data)
			: CommandAPI.update(telegramBot.id, commandID!, data));

		if (!response.ok) {
			for (const error of response.json.errors) {
				if (!error.attr) continue;
				setFieldError(error.attr, error.detail);
			}
			createMessageToast({
				message: t(`messages.${type}Command.error`),
				level: 'error',
			});
			return;
		}

		(type === 'add' ? onAdd : onSave)?.(response.json);
		hideOffcanvas();
		createMessageToast({
			message: t(`messages.${type}Command.success`),
			level: 'success',
		});
	}

	return (
		<Formik
			initialValues={defaultFormValues}
			validateOnBlur={false}
			validateOnChange={false}
			onSubmit={handleSubmit}
		>
			<InnerCommandOffcanvas />
		</Formik>
	);
}

export default CommandOffcanvas;
