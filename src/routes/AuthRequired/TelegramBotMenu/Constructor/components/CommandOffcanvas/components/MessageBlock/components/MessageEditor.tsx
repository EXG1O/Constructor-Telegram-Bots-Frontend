import React, { ReactElement } from 'react';

import TelegramQuillEditor, {
	TelegramQuillEditorProps,
} from 'components/TelegramQuillEditor';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type MessageEditorProps = Omit<
	TelegramQuillEditorProps,
	'height' | 'toolbar' | 'value' | 'placeholder' | 'onChange'
>;

function MessageEditor(props: MessageEditorProps): ReactElement<MessageEditorProps> {
	const message = useCommandOffcanvasStore((state) => state.message);
	const setMessage = useCommandOffcanvasStore((state) => state.setMessage);

	return (
		<TelegramQuillEditor
			{...props}
			height={220}
			value={message}
			placeholder={gettext('Введите текст')}
			onChange={setMessage}
		/>
	);
}

export default MessageEditor;
