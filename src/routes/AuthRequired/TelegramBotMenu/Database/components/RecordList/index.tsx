import React, { ReactElement, memo } from 'react';
import classNames from 'classnames';

import ListGroup, { ListGroupProps } from 'react-bootstrap/ListGroup';

import Loading from 'components/Loading';

import RecordDisplay from './components/RecordDisplay';
import Block from './components/Block';

import useRecords from '../../hooks/useRecords';

export interface RecordListProps extends Omit<ListGroupProps, 'children'> {
	loading: boolean;
}

function RecordList({ loading, className, ...props }: RecordListProps): ReactElement<RecordListProps> {
	const { records, filter } = useRecords();

	return (
		!loading ? (
			records.length ? (
				<ListGroup {...props} className={classNames(className, 'rounded-1')}>
					{records.map(record => (
						<RecordDisplay key={record.id} record={record} />
					))}
				</ListGroup>
			) : filter.search ? (
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
		)
	);
}

export default memo(RecordList);