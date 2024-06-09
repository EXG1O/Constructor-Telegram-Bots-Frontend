import React, { ReactElement } from 'react';

import Button from 'react-bootstrap/Button';

import Offcanvas, { OffcanvasProps } from 'components/Offcanvas';

import StoreProvider from './providers/StoreProvider';

import NameBlock from '../NameBlock';
import SettingsBlock from './components/SettingsBlock';
import TriggerBlock from './components/TriggerBlock';
import ImagesBlock from './components/ImagesBlock';
import FilesCard from './components/FilesBlock';
import MessageBlock from './components/MessageBlock';
import KeyboardBlock from './components/KeyboardBlock';
import APIRequestBlock from './components/APIRequestBlock';
import DatabaseRecordBlock from './components/DatabaseRecordBlock';

import TelegramBotStorage from './components/TelegramBotStorage';
import AddonButtonGroup, { AddonButtonProps } from '../AddonButtonGroup';

import { State } from './store';

import useCommandOffcanvasStore from './hooks/useCommandOffcanvasStore';

export type CommandFormOffcanvasProps = Omit<
	OffcanvasProps,
	'show' | 'children' | 'onHide'
>;

const addonButtons: AddonButtonProps<State>[] = [
	{
		stateName: 'showTriggerBlock',
		actionName: 'setShowTriggerBlock',
		children: gettext('Триггер'),
	},
	{
		stateName: 'showImagesBlock',
		actionName: 'setShowImagesBlock',
		children: gettext('Изображения'),
	},
	{
		stateName: 'showFilesBlock',
		actionName: 'setShowFilesBlock',
		children: gettext('Файлы'),
	},
	{
		stateName: 'showKeyboardBlock',
		actionName: 'setShowKeyboardBlock',
		children: gettext('Клавиатура'),
	},
	{
		stateName: 'showAPIRequestBlock',
		actionName: 'setShowAPIRequestBlock',
		children: gettext('API-запрос'),
	},
	{
		stateName: 'showDatabaseRecordBlock',
		actionName: 'setShowDatabaseRecordBlock',
		children: gettext('Запись в базу данных'),
	},
];

function CommandOffcanvas(
	props: CommandFormOffcanvasProps,
): ReactElement<CommandFormOffcanvasProps> {
	const store = useCommandOffcanvasStore();

	const type = useCommandOffcanvasStore((state) => state.type);
	const show = useCommandOffcanvasStore((state) => state.show);
	const loading = useCommandOffcanvasStore((state) => state.loading);

	const add = useCommandOffcanvasStore((state) => state.add);
	const save = useCommandOffcanvasStore((state) => state.save);

	const hide = useCommandOffcanvasStore((state) => state.hide);

	return (
		<Offcanvas {...props} show={show} loading={loading} onHide={hide}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title as='h5'>
					{type === 'add'
						? gettext('Добавление команды')
						: gettext('Редактирование команды')}
				</Offcanvas.Title>
			</Offcanvas.Header>
			<Offcanvas.Body>
				<NameBlock store={store} className='mb-3' />
				<SettingsBlock className='mb-3' />
				<TriggerBlock className='mb-3' />
				<ImagesBlock className='mb-3' />
				<FilesCard className='mb-3' />
				<MessageBlock className='mb-3' />
				<KeyboardBlock className='mb-3' />
				<APIRequestBlock className='mb-3' />
				<DatabaseRecordBlock className='mb-3' />
			</Offcanvas.Body>
			<Offcanvas.Footer className='gap-2'>
				<TelegramBotStorage size='sm' />
				<AddonButtonGroup store={store} addonButtons={addonButtons} />
			</Offcanvas.Footer>
			<Offcanvas.Footer>
				<Button
					variant='success'
					{...(type === 'add'
						? {
								children: gettext('Добавить'),
								onClick: add,
							}
						: {
								children: gettext('Сохранить'),
								onClick: save,
							})}
				/>
			</Offcanvas.Footer>
		</Offcanvas>
	);
}

export default Object.assign(CommandOffcanvas, { StoreProvider });
