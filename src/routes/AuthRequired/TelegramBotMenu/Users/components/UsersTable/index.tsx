import React, { ReactElement } from 'react';
import classNames from 'classnames';

import Table from 'react-bootstrap/Table';

import Loading from 'components/Loading';

import Block, { BlockProps } from './components/Block';
import TableRow from './components/TableRow';
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
			<Block {...props} className={classNames('overflow-hidden', className)}>
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
			</Block>
		) : filter.search ? (
			<Block className='text-center px-3 py-2'>
				{gettext('Не найдены пользователи по поиску')}
			</Block>
		) : filter.type === 'allowed' ? (
			<Block className='text-center px-3 py-2'>
				{gettext('У вас нет разрешённых пользователей')}
			</Block>
		) : filter.type === 'blocked' ? (
			<Block className='text-center px-3 py-2'>
				{gettext('У вас нет заблокированных пользователей')}
			</Block>
		) : (
			<Block className='text-center px-3 py-2'>
				{gettext('Вашего Telegram бота ещё никто не активировал')}
			</Block>
		)
	) : (
		<Block className='d-flex justify-content-center p-3'>
			<Loading size='md' />
		</Block>
	);
}

export default UsersTable;
