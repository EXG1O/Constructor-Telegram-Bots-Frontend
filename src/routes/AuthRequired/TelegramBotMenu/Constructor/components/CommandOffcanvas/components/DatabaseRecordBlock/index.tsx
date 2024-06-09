import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../../../Block';

import BlockCollapse from './components/BlockCollapse';
import DatabaseRecordEditor from './components/DatabaseRecordEditor';

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
