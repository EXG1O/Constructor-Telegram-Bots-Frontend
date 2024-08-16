import React, { memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { editor } from 'monaco-editor';

import('./index.scss');

import Editor, { EditorProps, Monaco, OnChange, OnMount } from '@monaco-editor/react';

import EditorLoading from './components/EditorLoading';

export interface Editor extends editor.IStandaloneCodeEditor {
	updateLayout: (shouldResetWidth?: boolean) => void;
}

export interface MonacoEditorProps
	extends Omit<EditorProps, 'loading' | 'onChange' | 'onMount'> {
	size?: 'sm' | 'lg';
	disablePadding?: boolean;
	disableFocus?: boolean;
	onChange?: (editor: Editor, value: string) => void;
	onMount?: (editor: Editor, monaco: Monaco) => void;
}

const lineHeights: Record<string, number> = { sm: 19, lg: 22 };
const fontSizes: Record<string, number> = { sm: 14, lg: 18 };
const roundedValues: Record<string, number> = { sm: 1, lg: 3 };

const baseOptions: editor.IStandaloneEditorConstructionOptions = {
	minimap: { enabled: false },
	renderLineHighlight: 'none',
	lineNumbersMinChars: 3,
	overviewRulerLanes: 0,
	scrollBeyondLastLine: false,
	scrollbar: { vertical: 'hidden' },
	inlayHints: { enabled: 'off' },
	contextmenu: false,
};

function MonacoEditor({
	size,
	disablePadding,
	disableFocus,
	options,
	className,
	onChange,
	onMount,
	...props
}: MonacoEditorProps): ReactElement<MonacoEditorProps> {
	const editor = useRef<Editor | undefined>(undefined);

	const lineHeight = useMemo<number>(() => (size ? lineHeights[size] : 22), [size]);
	const fontSize = useMemo<number>(() => (size ? fontSizes[size] : 16), [size]);
	const roundedValue = useMemo<number>(
		() => (size ? roundedValues[size] : 2),
		[size],
	);

	const baseClassName = useMemo<string>(
		() => `border rounded-${roundedValue}`,
		[roundedValue],
	);

	const updateLayout = useCallback((resetWidth?: boolean) => {
		if (!editor.current) return;

		const editorModel: editor.ITextModel | null = editor.current.getModel();

		if (editorModel === null) return;

		editor.current.layout({
			width: resetWidth
				? 0
				: editor.current.getContainerDomNode().querySelector('.monaco-editor')!
						.clientWidth,
			height: editorModel.getLineCount() * lineHeight,
		});
	}, []);

	const handleChange = useCallback<OnChange>(
		(value) => {
			if (!editor.current || value === undefined) return;

			updateLayout();
			onChange?.(editor.current, value);
		},
		[onChange],
	);

	const handleMount = useCallback<OnMount>(
		(baseEditor, monaco) => {
			editor.current = Object.assign(baseEditor, { updateLayout });

			updateLayout();
			onMount?.(editor.current, monaco);
		},
		[onMount],
	);

	return (
		<Editor
			{...props}
			loading={<EditorLoading className={baseClassName} />}
			options={useMemo(
				() => ({ ...baseOptions, fontSize, ...options }),
				[options],
			)}
			className={classNames(
				baseClassName,
				'monaco-editor-wrapper overflow-hidden',
				{ 'p-show': !disablePadding, 'f-show': !disableFocus },
				className,
			)}
			onChange={handleChange}
			onMount={handleMount}
		/>
	);
}

export default memo(MonacoEditor);
