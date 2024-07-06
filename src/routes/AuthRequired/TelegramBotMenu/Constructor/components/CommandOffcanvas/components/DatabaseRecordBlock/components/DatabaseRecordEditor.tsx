import React, { memo, ReactElement, useCallback } from 'react';
import monaco from 'monaco-editor';

import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type DatabaseRecordEditorProps = Omit<
	MonacoEditorProps,
	'language' | 'value' | 'options' | 'onChange'
>;

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
	glyphMargin: false,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

function DatabaseRecordEditor(
	props: DatabaseRecordEditorProps,
): ReactElement<DatabaseRecordEditorProps> {
	const databaseRecord = useCommandOffcanvasStore((state) => state.databaseRecord);
	const setDatabaseRecord = useCommandOffcanvasStore(
		(state) => state.setDatabaseRecord,
	);

	const handleChange = useCallback<NonNullable<MonacoEditorProps['onChange']>>(
		(_editor, value) => setDatabaseRecord(value),
		[],
	);

	return (
		<MonacoEditor
			{...props}
			language='json'
			value={databaseRecord}
			options={options}
			onChange={handleChange}
		/>
	);
}

export default memo(DatabaseRecordEditor);
