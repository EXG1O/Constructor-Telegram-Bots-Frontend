import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import monaco from 'monaco-editor';

import { RouteID } from 'routes';

import FormMonacoEditorFeedback from 'components/FormMonacoEditorFeedback';

import Block, { BlockProps } from '../../Block';

export interface DatabaseRecord {
	data: string;
}

export type DatabaseRecordBlockProps = Pick<BlockProps, 'className'>;

export const defaultDatabaseRecord: DatabaseRecord = {
	data: JSON.stringify({ key: 'value' }, undefined, 4),
};

const monacoOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
	glyphMargin: false,
	folding: false,
	lineNumbers: 'off',
	lineDecorationsWidth: 0,
	lineNumbersMinChars: 0,
};

function DatabaseRecordBlock(
	props: DatabaseRecordBlockProps,
): ReactElement<DatabaseRecordBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.databaseRecordBlock',
	});

	return (
		<Block.Collapse name='show_database_block'>
			<Block {...props} title={t('title')} body>
				<FormMonacoEditorFeedback
					language='json'
					name='database_record.data'
					options={monacoOptions}
				/>
			</Block>
		</Block.Collapse>
	);
}

export default memo(DatabaseRecordBlock);
