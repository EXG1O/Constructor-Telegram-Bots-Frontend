import React, { ReactElement, memo, useCallback, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';

import CommandFormOffcanvas, { CommandFormOffcanvasProps } from './CommandFormOffcanvas';
import { defaultValue as nameDefaultValue } from './NameBlock';
import { defaultSettings } from './CommandFormOffcanvas/components/SettingsBlock';
import { defaultMessage } from './CommandFormOffcanvas/components/MessageBlock';

import useToast from 'services/hooks/useToast';

import useNameState from './CommandFormOffcanvas/hooks/useNameState';
import useSettingsState from './CommandFormOffcanvas/hooks/useSettingsState';
import useTriggerState from './CommandFormOffcanvas/hooks/useTriggerState';
import useImagesState from './CommandFormOffcanvas/hooks/useImagesState';
import useFilesState from './CommandFormOffcanvas/hooks/useFilesState';
import useMessageState from './CommandFormOffcanvas/hooks/useMessageState';
import useKeyboardState from './CommandFormOffcanvas/hooks/useKeyboardState';
import useAPIRequestState from './CommandFormOffcanvas/hooks/useAPIRequestState';
import useDatabaseRecordState from './CommandFormOffcanvas/hooks/useDatabaseRecordState';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

import { parseNodes } from '../utils';

import { CommandsAPI, DiagramCommandAPI } from 'services/api/telegram_bots/main';

export interface CommandAdditionOffcanvasProps {
	show: boolean;
	onHide: () => void
}

function CommandAdditionOffcanvas({ onHide, ...props }: CommandAdditionOffcanvasProps): ReactElement<CommandAdditionOffcanvasProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();

	const { addNodes } = useReactFlow();

	const [name, setName] = useNameState();
	const [settings, setSettings] = useSettingsState();
	const [trigger, setTrigger] = useTriggerState();
	const [images, setImages] = useImagesState();
	const [files, setFiles] = useFilesState();
	const [message, setMessage] = useMessageState();
	const [keyboard, setKeyboard] = useKeyboardState();
	const [apiRequest, setAPIRequest] = useAPIRequestState();
	const [databaseRecord, setDatabaseRecord] = useDatabaseRecordState();

	const [loading, setLoading] = useState<boolean>(false);

	const handleExited = useCallback<NonNullable<CommandFormOffcanvasProps['onExited']>>(() => {
		setName(nameDefaultValue);
		setSettings(defaultSettings);
		setTrigger(undefined);
		setImages(undefined);
		setFiles(undefined);
		setMessage(defaultMessage);
		setKeyboard(undefined);
		setAPIRequest(undefined);
		setDatabaseRecord(undefined);
	}, []);

	async function handleClick(): Promise<void> {
		setLoading(true);

		const commandResponse = await CommandsAPI.create(telegramBot.id, {
			name: name,
			settings: {
				is_reply_to_user_message: settings.isReplyToUserMessage,
				is_delete_user_message: settings.isDeleteUserMessage,
				is_send_as_new_message: settings.isSendAsNewMessage,
			},
			trigger: trigger ? {
				...trigger,
				description: trigger.description ?? null,
			} : null,
			images: images?.map(image => image.file!),
			files: files?.map(file => file.file!),
			message: { text: message },
			keyboard: keyboard ? {
				...keyboard,
				buttons: keyboard.buttons.map(button => ({
					...button,
					row: button.row ?? null,
					url: button.url ?? null,
				})),
			} : null,
			api_request: apiRequest ? {
				...apiRequest,
				headers: apiRequest.headers ? apiRequest.headers.map(header => ({ [header.key]: header.value })) : null,
				body: apiRequest.body ? JSON.parse(apiRequest.body) : null,
			} : null,
			database_record: databaseRecord ? { data: JSON.parse(databaseRecord) } : null,
		});

		if (commandResponse.ok) {
			const diagramCommandResponse = await DiagramCommandAPI.get(telegramBot.id, commandResponse.json.id);

			if (diagramCommandResponse.ok) {
				addNodes(parseNodes([diagramCommandResponse.json]));
				onHide();
				createMessageToast({
					message: gettext('Вы успешно добавили команду.'),
					level: 'success',
				});
			} else {
				createMessageToast({
					message: gettext('Не удалось получить добавленную ранее команду!'),
					level: 'error',
				});
			}
		} else {
			createMessageToast({
				message: gettext('Не удалось добавить команду!'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<CommandFormOffcanvas
			{...props}
			loading={loading}
			name={name}
			settings={settings}
			trigger={trigger}
			images={images}
			files={files}
			message={message}
			keyboard={keyboard}
			apiRequest={apiRequest}
			databaseRecord={databaseRecord}
			title={gettext('Добавление команды')}
			onNameChange={setName}
			onSettingsChange={setSettings}
			onTriggerChange={setTrigger}
			onImagesChange={setImages}
			onFilesChange={setFiles}
			onMessageChange={setMessage}
			onKeyboardChange={setKeyboard}
			onAPIRequestChange={setAPIRequest}
			onDatabaseRecordChange={setDatabaseRecord}
			onExited={handleExited}
			onHide={onHide}
		>
			<CommandFormOffcanvas.Footer>
				<Button
					variant='success'
					onClick={handleClick}
				>
					{gettext('Добавить')}
				</Button>
			</CommandFormOffcanvas.Footer>
		</CommandFormOffcanvas>
	);
}

export default memo(CommandAdditionOffcanvas);