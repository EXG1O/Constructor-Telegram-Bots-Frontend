import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';

import ListGroup, { ListGroupProps } from 'react-bootstrap/ListGroup';

import Loading from 'components/Loading';

import TableRow from './components/TableRow';
import TableWrapper from './components/TableWrapper';

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
					<TableRow key={record.id} record={record} />
				))}
			</ListGroup>
		) : search ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Поиск по записям не дал результатов')}
			</TableWrapper>
		) : (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Вы ещё не добавили записи')}
			</TableWrapper>
		)
	) : (
		<TableWrapper className='d-flex justify-content-center p-3'>
			<Loading size='md' />
		</TableWrapper>
	);
}

export default memo(RecordList);
