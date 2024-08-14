import React, { ReactElement } from 'react';
import classNames from 'classnames';

import Table from 'react-bootstrap/Table';

import Loading from 'components/Loading';

import TableRow from './components/TableRow';
import TableWrapper, { BlockProps } from './components/TableWrapper';
import UserContext from './contexts/UserContext';

import useUsers from '../../hooks/useUsers';

export interface UsersTableProps extends Omit<BlockProps, 'children'> {
	loading: boolean;
}

function UsersTable({
	loading,
	className,
	...props
}: UsersTableProps): ReactElement<UsersTableProps> {
	const { users, filter } = useUsers();

	return !loading ? (
		users.length ? (
			<TableWrapper
				{...props}
				className={classNames('overflow-hidden', className)}
			>
				<Table
					responsive
					striped
					borderless
					className='align-middle text-nowrap mb-0'
				>
					<tbody>
						{users.map((user) => (
							<UserContext.Provider key={user.id} value={{ user }}>
								<TableRow key={user.id} />
							</UserContext.Provider>
						))}
					</tbody>
				</Table>
			</TableWrapper>
		) : filter.search ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Не найдены пользователи по поиску')}
			</TableWrapper>
		) : filter.type === 'allowed' ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('У вас нет разрешённых пользователей')}
			</TableWrapper>
		) : filter.type === 'blocked' ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('У вас нет заблокированных пользователей')}
			</TableWrapper>
		) : (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Вашего Telegram бота ещё никто не активировал')}
			</TableWrapper>
		)
	) : (
		<TableWrapper className='d-flex justify-content-center p-3'>
			<Loading size='md' />
		</TableWrapper>
	);
}

export default UsersTable;
