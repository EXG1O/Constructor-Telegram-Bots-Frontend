import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormCheckFeedback from 'components/FormCheckFeedback';
import Stack from 'components/Stack';

import Block, { BlockProps } from '../../Block';

export interface Settings {
	is_reply_to_user_message: boolean;
	is_delete_user_message: boolean;
	is_send_as_new_message: boolean;
}

export type SettingsBlockProps = Pick<BlockProps, 'className'>;

export const defaultSettings: Settings = {
	is_reply_to_user_message: false,
	is_delete_user_message: false,
	is_send_as_new_message: false,
};

function SettingsBlock(props: SettingsBlockProps): ReactElement<SettingsBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.settingsBlock',
	});

	return (
		<Block {...props} title={t('title')}>
			<Block.Body as={Stack} gap={2}>
				<FormCheckFeedback
					type='switch'
					name='settings.is_reply_to_user_message'
					label={t('replyToUserMessageSwitch')}
				/>
				<FormCheckFeedback
					type='switch'
					name='settings.is_delete_user_message'
					label={t('deleteUserMessageSwitch')}
				/>
				<FormCheckFeedback
					type='switch'
					name='settings.is_send_as_new_message'
					label={t('sendAsNewMessageSwitch')}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(SettingsBlock);
