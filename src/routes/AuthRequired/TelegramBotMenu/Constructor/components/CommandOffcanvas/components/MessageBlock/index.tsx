import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import MessageEditor from './components/MessageEditor';

import Block, { BlockProps } from '../../../Block';

export type Message = string;

export type MessageBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultMessage: Message = '';

function MessageBlock(props: MessageBlockProps): ReactElement<MessageBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.messageBlock',
	});

	return (
		<Block {...props} title={t('title')} body>
			<MessageEditor />
		</Block>
	);
}

export default memo(MessageBlock);
