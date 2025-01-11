import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormTelegramQuillEditorFeedback from 'components/FormTelegramQuillEditorFeedback';

import Block, { BlockProps } from '../../Block';

export interface Message {
	text: string;
}

export type MessageBlockProps = Pick<BlockProps, 'className'>;

export const defaultMessage: Message = { text: '' };

function MessageBlock(props: MessageBlockProps): ReactElement<MessageBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.messageBlock',
	});

	return (
		<Block {...props} title={t('title')} body>
			<FormTelegramQuillEditorFeedback
				height={220}
				name='message.text'
				placeholder={t('messageEditorPlaceholder')}
			/>
		</Block>
	);
}

export default memo(MessageBlock);
