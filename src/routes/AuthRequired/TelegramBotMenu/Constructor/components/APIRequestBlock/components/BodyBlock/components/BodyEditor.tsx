import React, { ReactElement, memo, useCallback } from 'react';
import monaco from 'monaco-editor';

import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';

import useAPIRequestBlockStore from '../../../hooks/useAPIRequestBlockStore';

export type BodyEditorProps = Omit<
	MonacoEditorProps,
	'size' | 'language' | 'value' | 'options' | 'onChange'
>;

const options: monaco.editor.IStandaloneEditorConstructionOptions = {
	glyphMargin: false,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

function BodyEditor(props: BodyEditorProps): ReactElement<BodyEditorProps> {
	const body = useAPIRequestBlockStore((state) => state.apiRequest.body);
	const updateAPIRequest = useAPIRequestBlockStore((state) => state.updateAPIRequest);

	const handleChange = useCallback<NonNullable<MonacoEditorProps['onChange']>>(
		(editor, value) =>
			updateAPIRequest((apiRequest) => {
				apiRequest.body = value;
			}),
		[],
	);

	return (
		<MonacoEditor
			{...props}
			size='sm'
			language='json'
			value={body}
			options={options}
			onChange={handleChange}
		/>
	);
}

export default memo(BodyEditor);
