import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import MessageEditor from './components/MessageEditor';

import Block, { BlockProps } from '../../../Block';

export type Message = string;

export type MessageBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultMessage: Message = '';

function MessageBlock(props: MessageBlockProps): ReactElement<MessageBlockProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.messageBlock',
	});

	return (
		<Block {...props} title={t('title')} body>
			<MessageEditor />
		</Block>
	);
}

export default memo(MessageBlock);
