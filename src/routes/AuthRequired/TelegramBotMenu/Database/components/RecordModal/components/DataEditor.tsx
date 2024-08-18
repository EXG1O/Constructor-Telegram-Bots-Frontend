import React, { memo, ReactElement, useCallback } from 'react';
import { editor } from 'monaco-editor';

import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';

import useRecordModalStore from '../hooks/useRecordModalStore';

export type Data = string;

export const defaultData: Data = JSON.stringify({ key: 'value' }, undefined, 4);

const options: editor.IStandaloneEditorConstructionOptions = {
	glyphMargin: false,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

function DataEditor(): ReactElement {
	const data = useRecordModalStore((state) => state.data);
	const setData = useRecordModalStore((state) => state.setData);

	const handleChange = useCallback<NonNullable<MonacoEditorProps['onChange']>>(
		(_editor, value) => setData(value),
		[],
	);

	return (
		<MonacoEditor
			value={data}
			language='json'
			options={options}
			onChange={handleChange}
		/>
	);
}

export default memo(DataEditor);
