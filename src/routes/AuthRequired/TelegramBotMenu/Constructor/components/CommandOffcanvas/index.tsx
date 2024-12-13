import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Button from 'components/Button';
import Offcanvas, { OffcanvasProps } from 'components/Offcanvas';

import APIRequestBlock from './components/APIRequestBlock';
import DatabaseRecordBlock from './components/DatabaseRecordBlock';
import FilesCard from './components/FilesBlock';
import ImagesBlock from './components/ImagesBlock';
import KeyboardBlock from './components/KeyboardBlock';
import MessageBlock from './components/MessageBlock';
import SettingsBlock from './components/SettingsBlock';
import TelegramBotStorage from './components/TelegramBotStorage';
import TriggerBlock from './components/TriggerBlock';
import StoreProvider from './providers/StoreProvider';

import AddonButtonGroup, { AddonButtonProps } from '../AddonButtonGroup';
import NameBlock from '../NameBlock';

import useCommandOffcanvasStore from './hooks/useCommandOffcanvasStore';

import { State } from './store';

export type CommandFormOffcanvasProps = Omit<
	OffcanvasProps,
	'show' | 'children' | 'onHide'
>;

function CommandOffcanvas(
	props: CommandFormOffcanvasProps,
): ReactElement<CommandFormOffcanvasProps> {
	const { t, i18n } = useTranslation(RouteID.TelegramBotMenuConstructor);

	const store = useCommandOffcanvasStore();

	const type = useCommandOffcanvasStore((state) => state.type);
	const show = useCommandOffcanvasStore((state) => state.show);
	const loading = useCommandOffcanvasStore((state) => state.loading);

	const add = useCommandOffcanvasStore((state) => state.add);
	const save = useCommandOffcanvasStore((state) => state.save);

	const hide = useCommandOffcanvasStore((state) => state.hide);

	const addonButtons = useMemo<AddonButtonProps<State>[]>(
		() => [
			{
				stateName: 'showTriggerBlock',
				actionName: 'setShowTriggerBlock',
				children: t('commandOffcanvas.triggerBlock.title'),
			},
			{
				stateName: 'showImagesBlock',
				actionName: 'setShowImagesBlock',
				children: t('commandOffcanvas.imagesBlock.title'),
			},
			{
				stateName: 'showFilesBlock',
				actionName: 'setShowFilesBlock',
				children: t('commandOffcanvas.filesBlock.title'),
			},
			{
				stateName: 'showKeyboardBlock',
				actionName: 'setShowKeyboardBlock',
				children: t('commandOffcanvas.keyboardBlock.title'),
			},
			{
				stateName: 'showAPIRequestBlock',
				actionName: 'setShowAPIRequestBlock',
				children: t('apiRequestBlock.title'),
			},
			{
				stateName: 'showDatabaseRecordBlock',
				actionName: 'setShowDatabaseRecordBlock',
				children: t('commandOffcanvas.databaseRecordBlock.title'),
			},
		],
		[i18n.language],
	);

	return (
		<Offcanvas {...props} show={show} loading={loading} onHide={hide}>
			<Offcanvas.Header closeButton>
				<Offcanvas.Title>
					{t('commandOffcanvas.title', { context: type })}
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
				<Button variant='success' onClick={type === 'add' ? add : save}>
					{t('commandOffcanvas.button', { context: type })}
				</Button>
			</Offcanvas.Footer>
		</Offcanvas>
	);
}

export default Object.assign(CommandOffcanvas, { StoreProvider });
