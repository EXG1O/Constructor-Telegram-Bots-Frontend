import React, { ReactElement, memo, useRef, useMemo, useState, useCallback } from 'react';
import classNames from 'classnames';
import monaco from 'monaco-editor';

import('./MonacoEditor.scss');

import BaseMonacoEditor, { Monaco, EditorProps as BaseMonacoEditorProps } from '@monaco-editor/react';

import Loading from './Loading';

export interface Editor extends monaco.editor.IStandaloneCodeEditor {
	updateLayout: (shouldResetWidth?: boolean) => void;
}

export interface MonacoEditorProps extends Omit<BaseMonacoEditorProps, 'loading' | 'onChange'> {
	size?: 'sm' | 'lg';
	disablePadding?: boolean;
	disableFocusEffect?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	onChange?: (editor: Editor, value: string) => void
	OnMount?: (editor: Editor, monaco: Monaco) => void;
}

function MonacoEditor({
	size,
	disablePadding,
	disableFocusEffect,
	options,
	className,
	onFocus,
	onBlur,
	onChange,
	onMount,
	...props
}: MonacoEditorProps): ReactElement<MonacoEditorProps> {
	const editor = useRef<Editor | undefined>(undefined);

	const lineHeight = useMemo<number>(() => size === 'sm' ? 19 : size === 'lg' ? 24 : 22, [size]);
	const fontSize = useMemo<number>(() => size === 'sm' ? 14 : size === 'lg' ? 18 : 16, [size]);
	const roundedValue = useMemo<number>(() =>  size === 'sm' ? 1 : size === 'lg' ? 3 : 2, [size]);
	const baseClassName = useMemo<string>(() => classNames(`border rounded-${roundedValue}`), [roundedValue]);

	const [focus, setFocus] = useState<boolean>(false);

	function updateLayout(shouldResetWidth?: boolean): void {
		if (editor.current) {
			const editorModel: monaco.editor.ITextModel | null = editor.current.getModel();

			if (editorModel !== null) {
				editor.current.layout({
					width: shouldResetWidth ? 0 : editor.current.getContainerDomNode().querySelector('.monaco-editor')!.clientWidth,
					height: editorModel.getLineCount() * lineHeight,
				});
			}
		}
	}

	function handleFocus(): void {
		if (!disableFocusEffect) {
			setFocus(true);
		}

		onFocus?.();
	}

	function handleBlur(): void {
		if (!disableFocusEffect) {
			setFocus(false);
		}

		onBlur?.();
	}

	const handleChange = useCallback<NonNullable<BaseMonacoEditorProps['onChange']>>(value => {
		if (editor.current && value !== undefined) {
			updateLayout();
			onChange?.(editor.current, value);
		}
	}, [onChange]);

	const handleMount = useCallback<NonNullable<BaseMonacoEditorProps['onMount']>>((baseEditor, monaco) => {
		editor.current = Object.assign(baseEditor, { updateLayout });

		editor.current.onDidFocusEditorText(handleFocus);
		editor.current.onDidBlurEditorText(handleBlur);

		updateLayout();

		onMount?.(editor.current, monaco);
	}, [onMount]);

	return (
		<BaseMonacoEditor
			{...props}
			loading={
				<div className={classNames(baseClassName, 'd-flex justify-content-center w-100 p-2')}>
					<Loading size='sm' />
				</div>
			}
			options={useMemo(() => ({
				minimap: { enabled: false },
				renderLineHighlight: 'none',
				lineNumbersMinChars: 3,
				overviewRulerLanes: 0,
				scrollBeyondLastLine: false,
				scrollbar: { vertical: 'hidden' },
				inlayHints: { enabled: 'off' },
				contextmenu: false,
				fontSize,
				...options,
			}), [options])}
			className={
				classNames(
					baseClassName,
					'monaco-editor-wrapper overflow-hidden',
					{ padding: !disablePadding, focus },
					className,
				)
			}
			onChange={handleChange}
			onMount={handleMount}
		/>
	);
}

export default memo(MonacoEditor);