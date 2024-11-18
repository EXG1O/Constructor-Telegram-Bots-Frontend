import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import SettingSwitch from './components/SettingSwitch';

import Block, { BlockProps } from '../../../Block';

export interface Settings {
	isReplyToUserMessage: boolean;
	isDeleteUserMessage: boolean;
	isSendAsNewMessage: boolean;
}

export type SettingsBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultSettings: Settings = {
	isReplyToUserMessage: false,
	isDeleteUserMessage: false,
	isSendAsNewMessage: false,
};

function SettingsBlock(props: SettingsBlockProps): ReactElement<SettingsBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.settingsBlock',
	});

	return (
		<Block {...props} title={t('title')}>
			<Block.Body className='vstack gap-2'>
				<SettingSwitch
					settingName='isReplyToUserMessage'
					label={t('replyToUserMessageSwitch')}
				/>
				<SettingSwitch
					settingName='isDeleteUserMessage'
					label={t('deleteUserMessageSwitch')}
				/>
				<SettingSwitch
					settingName='isSendAsNewMessage'
					label={t('sendAsNewMessageSwitch')}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(SettingsBlock);
