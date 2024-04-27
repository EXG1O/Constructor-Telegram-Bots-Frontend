import React, { ReactElement, memo } from 'react';

import Form from 'react-bootstrap/Form';

import Block, { BlockProps } from '../../Block';

export interface Settings {
	isReplyToUserMessage: boolean;
	isDeleteUserMessage: boolean;
	isSendAsNewMessage: boolean;
}

export interface SettingsBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	settings?: Settings;
	onChange: (settings: Settings) => void;
}

export const defaultSettings: Settings = {
	isReplyToUserMessage: false,
	isDeleteUserMessage: false,
	isSendAsNewMessage: false,
}

function SettingsBlock({ settings = defaultSettings, onChange, ...props }: SettingsBlockProps): ReactElement<SettingsBlockProps> {
	return (
		<Block {...props} title={gettext('Настройки')}>
			<Block.Body className='vstack gap-2'>
				<Form.Switch
					checked={settings.isReplyToUserMessage}
					label={gettext('Ответить на сообщение пользователя')}
					onChange={e => onChange({ ...settings, isReplyToUserMessage: e.target.checked })}
				/>
				<Form.Switch
					checked={settings.isDeleteUserMessage}
					label={gettext('Удалить сообщение пользователя')}
					onChange={e => onChange({ ...settings, isDeleteUserMessage: e.target.checked })}
				/>
				<Form.Switch
					checked={settings.isSendAsNewMessage}
					label={gettext('Отправить сообщение как новое')}
					onChange={e => onChange({ ...settings, isSendAsNewMessage: e.target.checked })}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(SettingsBlock);