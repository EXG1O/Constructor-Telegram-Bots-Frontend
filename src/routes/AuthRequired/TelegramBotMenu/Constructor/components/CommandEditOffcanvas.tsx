import React, { ReactElement, memo, useEffect, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import { useReactFlow } from 'reactflow';
import Button from 'react-bootstrap/Button';

import CommandFormOffcanvas from './CommandFormOffcanvas';

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

import { CommandAPI, DiagramCommandAPI } from 'services/api/telegram_bots/main';

export interface CommandEditOffcanvasProps {
	show: boolean;
	commandID: number;
	onHide: () => void
}

function CommandEditOffcanvas({ show, commandID, onHide }: CommandEditOffcanvasProps): ReactElement<CommandEditOffcanvasProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const { createMessageToast } = useToast();

	const { setNodes } = useReactFlow();

	const [name, setName] = useNameState();
	const [settings, setSettings] = useSettingsState();
	const [trigger, setTrigger] = useTriggerState();
	const [images, setImages] = useImagesState();
	const [files, setFiles] = useFilesState();
	const [message, setMessage] = useMessageState();
	const [keyboard, setKeyboard] = useKeyboardState();
	const [apiRequest, setAPIRequest] = useAPIRequestState();
	const [databaseRecord, setDatabaseRecord] = useDatabaseRecordState();

	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => { show && updateInitialData() }, [show]);

	async function updateInitialData(): Promise<void> {
		setLoading(true);

		const response = await CommandAPI.get(telegramBot.id, commandID);

		if (response.ok) {
			const {
				id,
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

			setName(name);
			setSettings({
				isReplyToUserMessage: settings.is_reply_to_user_message,
				isDeleteUserMessage: settings.is_delete_user_message,
				isSendAsNewMessage: settings.is_send_as_new_message,
			});
			setTrigger(trigger ? {
				text: trigger.text,
				description: trigger.description ?? undefined,
			} : undefined);
			setImages(images.length ? images.map(image => ({ ...image, key: crypto.randomUUID() })) : undefined);
			setFiles(files.length ? files.map(file => ({ ...file, key: crypto.randomUUID() })) : undefined);
			setMessage(message.text);
			setKeyboard(keyboard ? {
				type: keyboard.type,
				buttons: keyboard.buttons.map(button => ({
					id: button.id,
					row: button.row ?? undefined,
					text: button.text,
					url: button.url ?? undefined,
				})),
			} : undefined);
			setAPIRequest(api_request ? {
				url: api_request.url,
				method: api_request.method,
				headers: api_request.headers ? Object.entries(api_request.headers).map(([key, value]) => ({ key, value })) : undefined,
				body: api_request.body ? JSON.stringify(api_request.body, undefined, 4) : undefined,
			} : undefined);
			setDatabaseRecord(database_record ? JSON.stringify(database_record.data, undefined, 4) : undefined);

			setLoading(false);
		} else {
			createMessageToast({
				message: gettext('Не удалось получить данные команды!'),
				level: 'error',
			});
		}
	}

	async function handleClick(): Promise<void> {
		setLoading(true);

		const commandResponse = await CommandAPI.update(telegramBot.id, commandID, {
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
			images: images?.map(image => image.file ?? image.id!),
			files: files?.map(file => file.file ?? file.id!),
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
			const diagramCommandResponse = await DiagramCommandAPI.get(telegramBot.id, commandID);

			if (diagramCommandResponse.ok) {
				setNodes(prevNodes => prevNodes.map(
					node => node.id === `command:${commandID}` ? parseNodes([diagramCommandResponse.json])[0] : node
				));
				onHide();
				createMessageToast({
					message: gettext('Вы успешно сохранили команду.'),
					level: 'success',
				});
			} else {
				createMessageToast({
					message: gettext('Не удалось получить сохранённую ранее команду!'),
					level: 'error',
				});
			}
		} else {
			createMessageToast({
				message: gettext('Не удалось сохранить команду!'),
				level: 'error',
			});
		}

		setLoading(false);
	}

	return (
		<CommandFormOffcanvas
			show={show}
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
			title={gettext('Редактирование команды')}
			onNameChange={setName}
			onSettingsChange={setSettings}
			onTriggerChange={setTrigger}
			onImagesChange={setImages}
			onFilesChange={setFiles}
			onMessageChange={setMessage}
			onKeyboardChange={setKeyboard}
			onAPIRequestChange={setAPIRequest}
			onDatabaseRecordChange={setDatabaseRecord}
			onHide={onHide}
		>
			<CommandFormOffcanvas.Footer>
				<Button
					variant='success'
					onClick={handleClick}
				>
					{gettext('Сохранить')}
				</Button>
			</CommandFormOffcanvas.Footer>
		</CommandFormOffcanvas>
	);
}

export default memo(CommandEditOffcanvas);