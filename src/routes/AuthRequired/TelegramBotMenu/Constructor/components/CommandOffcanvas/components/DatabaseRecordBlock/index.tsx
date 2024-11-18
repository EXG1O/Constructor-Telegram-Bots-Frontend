import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

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
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.databaseRecordBlock',
	});

	return (
		<BlockCollapse>
			<Block {...props} title={t('title')} body>
				<DatabaseRecordEditor />
			</Block>
		</BlockCollapse>
	);
}

export default memo(DatabaseRecordBlock);
