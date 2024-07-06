import React, { memo, ReactElement } from 'react';

import MessageEditor from './components/MessageEditor';

import Block, { BlockProps } from '../../../Block';

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
