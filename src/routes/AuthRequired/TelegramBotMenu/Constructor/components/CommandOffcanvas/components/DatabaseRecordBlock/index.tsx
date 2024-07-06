import React, { memo, ReactElement } from 'react';

import BlockCollapse from './components/BlockCollapse';
import DatabaseRecordEditor from './components/DatabaseRecordEditor';

import Block, { BlockProps } from '../../../Block';

export type DatabaseRecord = string;

export type DatabaseRecordBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultDatabaseRecord: DatabaseRecord = JSON.stringify(
	{ key: 'value' },
	undefined,
	4,
);

function DatabaseRecordBlock(
	props: DatabaseRecordBlockProps,
): ReactElement<DatabaseRecordBlockProps> {
	return (
		<BlockCollapse>
			<Block {...props} title={gettext('Запись в базу данных')} body>
				<DatabaseRecordEditor />
			</Block>
		</BlockCollapse>
	);
}

export default memo(DatabaseRecordBlock);
