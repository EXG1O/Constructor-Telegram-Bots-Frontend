import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';

import ListGroup, { ListGroupProps } from 'react-bootstrap/ListGroup';

import Loading from 'components/Loading';

import Block from './components/Block';
import RecordDisplay from './components/RecordDisplay';

import useDatabaseRecordsStore from '../../hooks/useDatabaseRecordsStore';

export interface RecordListProps extends Omit<ListGroupProps, 'children'> {}

function RecordList({
	className,
	...props
}: RecordListProps): ReactElement<RecordListProps> {
	const loading = useDatabaseRecordsStore((state) => state.loading);
	const search = useDatabaseRecordsStore((state) => state.search);
	const records = useDatabaseRecordsStore((state) => state.records);

	return !loading ? (
		records.length ? (
			<ListGroup {...props} className={classNames(className, 'rounded-1')}>
				{records.map((record) => (
					<RecordDisplay key={record.id} record={record} />
				))}
			</ListGroup>
		) : search ? (
			<Block className='text-center px-3 py-2'>
				{gettext('Поиск по записям не дал результатов')}
			</Block>
		) : (
			<Block className='text-center px-3 py-2'>
				{gettext('Вы ещё не добавили записи')}
			</Block>
		)
	) : (
		<Block className='d-flex justify-content-center p-3'>
			<Loading size='md' />
		</Block>
	);
}

export default memo(RecordList);
