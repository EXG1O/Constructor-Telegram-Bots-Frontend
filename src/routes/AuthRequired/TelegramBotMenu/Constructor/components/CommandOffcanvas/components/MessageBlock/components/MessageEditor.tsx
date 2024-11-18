import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import TelegramQuillEditor, {
	TelegramQuillEditorProps,
} from 'components/TelegramQuillEditor';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type MessageEditorProps = Omit<
	TelegramQuillEditorProps,
	'height' | 'toolbar' | 'value' | 'placeholder' | 'onChange'
>;

function MessageEditor(props: MessageEditorProps): ReactElement<MessageEditorProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.messageBlock.messageEditor',
	});

	const message = useCommandOffcanvasStore((state) => state.message);
	const setMessage = useCommandOffcanvasStore((state) => state.setMessage);

	return (
		<TelegramQuillEditor
			{...props}
			height={220}
			value={message}
			placeholder={t('placeholder')}
			onChange={setMessage}
		/>
	);
}

export default MessageEditor;
