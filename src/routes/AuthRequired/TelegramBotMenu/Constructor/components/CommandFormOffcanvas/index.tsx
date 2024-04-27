import React, { ReactElement, ReactNode, useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Collapse from 'react-bootstrap/Collapse';

import Offcanvas, { OffcanvasProps } from 'components/Offcanvas';
import TelegramBotStorage from 'components/TelegramBotStorage';

import NameBlock, { Value as NameValue } from '../NameBlock';
import SettingsBlock, { Settings } from './components/SettingsBlock';
import TriggerBlock, { Trigger, defaultTrigger } from './components/TriggerBlock';
import ImagesBlock, { Data as ImagesData, defaultData as imagesDefaultData } from './components/ImagesBlock';
import FilesCard, { Data as FilesData, defaultData as filesDefaultData } from './components/FilesBlock';
import MessageBlock, { Message } from './components/MessageBlock';
import KeyboardBlock, { Data as KeyboardData, defaultData as keyboardDefaultData } from './components/KeyboardBlock';
import APIRequestBlock, { Data as APIRequestData, defaultData as apiRequestDefaultData } from '../APIRequestBlock';
import DatabaseRecordBlock, { Value as DatabaseRecordValue, defaultValue as databaseRecordDefaultValue } from './components/DatabaseRecordBlock';
import AddonButtonGroup, { AddonButtonProps } from '../AddonButtonGroup';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

export interface CommandFormOffcanvasProps extends OffcanvasProps {
	name?: NameValue;
	settings?: Settings;
	trigger?: Trigger;
	images?: ImagesData;
	files?: FilesData,
	message?: Message;
	keyboard?: KeyboardData;
	apiRequest?: APIRequestData;
	databaseRecord?: DatabaseRecordValue;
	title: ReactNode;
	onNameChange: (value: NameValue) => void;
	onSettingsChange: (settings: Settings) => void;
	onTriggerChange: (trigger: Trigger | undefined) => void;
	onImagesChange: (data: ImagesData | undefined) => void;
	onFilesChange: (data: FilesData | undefined) => void;
	onMessageChange: (message: Message) => void;
	onKeyboardChange: (data: KeyboardData | undefined) => void;
	onAPIRequestChange: (data: APIRequestData | undefined) => void;
	onDatabaseRecordChange: (value: DatabaseRecordValue | undefined) => void;
}

type AddonNames = 'trigger' | 'images' | 'files' | 'keyboard' | 'apiRequest' | 'databaseRecord';

function CommandFormOffcanvas({
	name,
	settings,
	trigger,
	images,
	files,
	message,
	keyboard,
	apiRequest,
	databaseRecord,
	title,
	children,
	onNameChange,
	onSettingsChange,
	onTriggerChange,
	onImagesChange,
	onFilesChange,
	onMessageChange,
	onKeyboardChange,
	onAPIRequestChange,
	onDatabaseRecordChange,
	...props
}: CommandFormOffcanvasProps): ReactElement<CommandFormOffcanvasProps> {
	const { telegramBot } = useRouteLoaderData('telegram-bot-menu-root') as TelegramBotMenuRootLoaderData;

	const addonButtons = useMemo<AddonButtonProps<AddonNames>[]>(() => [
		{
			name: 'trigger',
			onShow: () => onTriggerChange(defaultTrigger),
			onHide: () => onTriggerChange(undefined),
			children: gettext('Триггер'),
		},
		{
			name: 'images',
			onShow: () => onImagesChange(imagesDefaultData),
			onHide: () => onImagesChange(undefined),
			children: gettext('Изображения'),
		},
		{
			name: 'files',
			onShow: () => onFilesChange(filesDefaultData),
			onHide: () => onFilesChange(undefined),
			children: gettext('Файлы'),
		},
		{
			name: 'keyboard',
			onShow: () => onKeyboardChange(keyboardDefaultData),
			onHide: () => onKeyboardChange(undefined),
			children: gettext('Клавиатура'),
		},
		{
			name: 'apiRequest',
			onShow: () => onAPIRequestChange(apiRequestDefaultData),
			onHide: () => onAPIRequestChange(undefined),
			children: gettext('API-запрос'),
		},
		{
			name: 'databaseRecord',
			onShow: () => onDatabaseRecordChange(databaseRecordDefaultValue),
			onHide: () => onDatabaseRecordChange(undefined),
			children: gettext('Запись в базу данных'),
		},
	], [
		onTriggerChange,
		onImagesChange,
		onFilesChange,
		onKeyboardChange,
		onAPIRequestChange,
		onDatabaseRecordChange,
	]);
	const showAddons = useMemo<Record<AddonNames, boolean>>(() => ({
		trigger: trigger !== undefined,
		images: images !== undefined,
		files: files !== undefined,
		keyboard: keyboard !== undefined,
		apiRequest: apiRequest !== undefined,
		databaseRecord: databaseRecord !== undefined,
	}), [trigger, images, files, keyboard, apiRequest, databaseRecord]);

	const usedStorageSize: number = useMemo(() => {
		let size: number = telegramBot.used_storage_size;

		size += images?.reduce((totalSize, image) => totalSize + image.size, 0) ?? 0;
		size += files?.reduce((totalSize, file) => totalSize + file.size, 0) ?? 0;

		return size;
	}, [images, files]);
	const remainingStorageSize: number = useMemo(() => telegramBot.storage_size - usedStorageSize, [usedStorageSize]);

	return (
		<Offcanvas {...props}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title as='h5'>{title}</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<NameBlock
					value={name}
					className='mb-3'
					onChange={onNameChange}
				/>
				<SettingsBlock
					settings={settings}
					className='mb-3'
					onChange={onSettingsChange}
				/>
				<Collapse in={showAddons.trigger} unmountOnExit>
					<div>
						<TriggerBlock
							trigger={trigger}
							className='mb-3'
							onChange={onTriggerChange}
						/>
					</div>
				</Collapse>
				<Collapse in={showAddons.images} unmountOnExit>
					<div id='command-offcanvas-image-addon'>
						<ImagesBlock
							data={images}
							remainingStorageSize={remainingStorageSize}
							className='mb-3'
							onChange={onImagesChange}
						/>
					</div>
				</Collapse>
				<Collapse in={showAddons.files} unmountOnExit>
					<div>
						<FilesCard
							data={files}
							remainingStorageSize={remainingStorageSize}
							className='mb-3'
							onChange={onFilesChange}
						/>
					</div>
				</Collapse>
				<MessageBlock
					message={message}
					className='mb-3'
					onChange={onMessageChange}
				/>
				<Collapse in={showAddons.keyboard} unmountOnExit>
					<div>
						<KeyboardBlock
							data={keyboard}
							className='mb-3'
							onChange={onKeyboardChange}
						/>
					</div>
				</Collapse>
				<Collapse in={showAddons.apiRequest} unmountOnExit>
					<div>
						<APIRequestBlock
							data={apiRequest}
							className='mb-3'
							onChange={onAPIRequestChange}
						/>
					</div>
				</Collapse>
				<Collapse in={showAddons.databaseRecord} unmountOnExit>
					<div>
						<DatabaseRecordBlock
							value={databaseRecord}
							className='mb-3'
							onChange={onDatabaseRecordChange}
						/>
					</div>
				</Collapse>
			</Offcanvas.Body>
			<Offcanvas.Footer className='gap-2'>
				<TelegramBotStorage
					size='sm'
					telegramBot={telegramBot}
					usedStorageSize={usedStorageSize}
				/>
				<AddonButtonGroup
					addonButtons={addonButtons}
					showAddons={showAddons}
				/>
			</Offcanvas.Footer>
			{children}
		</Offcanvas>
	);
}

export default Object.assign(CommandFormOffcanvas, { Footer: Offcanvas.Footer });