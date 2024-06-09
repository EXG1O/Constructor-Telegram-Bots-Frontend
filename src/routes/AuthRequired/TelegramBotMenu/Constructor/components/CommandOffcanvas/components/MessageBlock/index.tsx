import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../../../Block';

import MessageEditor from './components/MessageEditor';

export type Message = string;

export type MessageBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultMessage: Message = '';

function MessageBlock(props: MessageBlockProps): ReactElement<MessageBlockProps> {
	return (
		<Block {...props} title={gettext('Сообщение')} body>
			<MessageEditor />
		</Block>
	);
}

export default memo(MessageBlock);
