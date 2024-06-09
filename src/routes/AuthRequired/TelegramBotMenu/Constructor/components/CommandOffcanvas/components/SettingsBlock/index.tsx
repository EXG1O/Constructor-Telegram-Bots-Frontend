import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../../../Block';

import SettingSwitch from './components/SettingSwitch';

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
	return (
		<Block {...props} title={gettext('Настройки')}>
			<Block.Body className='vstack gap-2'>
				<SettingSwitch
					settingName='isReplyToUserMessage'
					label={gettext('Ответить на сообщение пользователя')}
				/>
				<SettingSwitch
					settingName='isDeleteUserMessage'
					label={gettext('Удалить сообщение пользователя')}
				/>
				<SettingSwitch
					settingName='isSendAsNewMessage'
					label={gettext('Отправить сообщение как новое')}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(SettingsBlock);
