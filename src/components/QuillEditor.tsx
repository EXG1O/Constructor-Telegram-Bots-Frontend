import React, { memo, ReactElement, useEffect, useRef } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import classNames from 'classnames';
import Quill from 'quill';

import('./QuillEditor.scss');

export type QuillEditor = Quill & ReactQuill;

export interface Toolbar {
	container: string[];
	handlers?: Record<string, (value: any) => void>;
}

export interface QuillEditorProps
	extends Omit<ReactQuillProps, 'modules' | 'children'> {
	height?: number;
	toolbar: Toolbar;
	onMount?: (quillEditor: QuillEditor) => void;
}

function QuillEditor({
	height,
	toolbar,
	className,
	onMount,
	...props
}: QuillEditorProps): ReactElement<QuillEditorProps> {
	const quillRef = useRef<Quill | null>(null);
	const reactQuillRef = useRef<ReactQuill | null>(null);

	useEffect(() => {
		if (!reactQuillRef.current) {
			throw Error('reactQuillRef should not be null.');
		}

		quillRef.current = reactQuillRef.current.getEditor() as unknown as Quill;

		if (height !== undefined) {
			quillRef.current.root.style.height = `${height}px`;
		}

		onMount?.(Object.assign(quillRef.current, reactQuillRef.current));
	}, []);

	return (
		<ReactQuill
			ref={reactQuillRef}
			{...props}
			modules={{ toolbar }}
			className={classNames('border rounded', className)}
		/>
	);
}

export default memo(QuillEditor);
