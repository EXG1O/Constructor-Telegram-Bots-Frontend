import React, { ReactElement, memo } from 'react';

import TelegramQuillEditor from 'components/TelegramQuillEditor';

import Block, { BlockProps } from '../../Block';

export type Message = string;

export interface MessageBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'> {
	message?: Message;
	onChange: (message: Message) => void;
}

export const defaultMessage: Message = '';

function MessageBlock({ message = defaultMessage, onChange, ...props }: MessageBlockProps): ReactElement<MessageBlockProps> {
	return (
		<Block {...props} title={gettext('Сообщение')}>
			<Block.Body>
				<TelegramQuillEditor
					height={220}
					value={message}
					placeholder={gettext('Введите текст')}
					onChange={onChange}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(MessageBlock);