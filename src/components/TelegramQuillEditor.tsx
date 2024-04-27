import React, { ReactElement, memo, useMemo } from 'react';
import Quill from 'quill';

import('./TelegramQuillEditor.scss');

import QuillEditor, { QuillEditorProps, Toolbar } from './QuillEditor';

const Inline = Quill.import('blots/inline');

class SpoilerBlot extends Inline {
	static blotName = 'spoiler';
	static tagName = 'tg-spoiler';
}

Quill.register(SpoilerBlot);

export interface TelegramQuillEditorProps extends Omit<QuillEditorProps, 'toolbar'> {
	toolbar?: Toolbar;
}

const baseToolbar: Toolbar = {
	container: [
		'bold',
		'italic',
		'underline',
		'strike',
		'link',
		'code',
		'code-block',
		'blockquote',
		'spoiler',
		'clean',
	],
}

function TelegramQuillEditor({ toolbar, ...props }: TelegramQuillEditorProps): ReactElement<TelegramQuillEditorProps> {
	return (
		<QuillEditor
			{...props}
			toolbar={useMemo(() => toolbar ? ({
				...toolbar,
				container: {
					...baseToolbar.container,
					...toolbar.container,
				},
			}) : baseToolbar, [toolbar])}
		/>
	);
}

export default memo(TelegramQuillEditor);