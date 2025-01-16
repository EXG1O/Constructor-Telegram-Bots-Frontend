import React, { memo, ReactElement, useCallback, useMemo, useRef } from 'react';
import classNames from 'classnames';
import * as monacoCore from 'monaco-editor';

import('./index.scss');

import Editor, {
	EditorProps,
	loader,
	Monaco,
	OnChange,
	OnMount,
} from '@monaco-editor/react';

import EditorLoading from './components/EditorLoading';

import settings from 'settings';

if (!settings.WEBPACK_SERVE) {
	loader.config({ monaco: monacoCore });
}

export interface Editor extends monacoCore.editor.IStandaloneCodeEditor {
	updateLayout: (shouldResetWidth?: boolean) => void;
}

export interface MonacoEditorProps
	extends Omit<EditorProps, 'loading' | 'onChange' | 'onMount'> {
	size?: 'sm' | 'lg';
	isChild?: boolean;
	onChange?: (editor: Editor, value: string) => void;
	onMount?: (editor: Editor, monaco: Monaco) => void;
}

const lineHeights: Record<string, number> = { sm: 19, lg: 22 };
const fontSizes: Record<string, number> = { sm: 14, lg: 18 };
const roundedValues: Record<string, number> = { sm: 1, lg: 3 };

const baseOptions: monacoCore.editor.IStandaloneEditorConstructionOptions = {
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
	isChild,
	options: extraOptions,
	className: extraClassName,
	onChange,
	onMount,
	...props
}: MonacoEditorProps): ReactElement<MonacoEditorProps> {
	const editor = useRef<Editor | undefined>(undefined);

	const lineHeight: number = size ? lineHeights[size] : 22;
	const fontSize: number = size ? fontSizes[size] : 16;
	const roundedValue: number = size ? roundedValues[size] : 2;

	const baseClassName: string = `border rounded-${roundedValue}`;
	const className = useMemo<string | undefined>(
		() =>
			isChild
				? extraClassName
				: classNames(
						baseClassName,
						'monaco-editor-wrapper overflow-hidden',
						extraClassName,
					),
		[baseClassName, extraClassName],
	);
	const options = useMemo<monacoCore.editor.IStandaloneEditorConstructionOptions>(
		() => ({ ...baseOptions, fontSize, ...extraOptions }),
		[extraOptions],
	);

	const updateLayout = useCallback((resetWidth?: boolean) => {
		if (!editor.current) return;

		const editorModel: monacoCore.editor.ITextModel | null =
			editor.current.getModel();

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
			options={options}
			className={className}
			onChange={handleChange}
			onMount={handleMount}
		/>
	);
}

export default memo(MonacoEditor);
