import React, { ReactElement } from 'react';
import classNames from 'classnames';

import Table from 'react-bootstrap/Table';

import Loading from 'components/Loading';

import TableRow from './components/TableRow';
import TableWrapper, { BlockProps } from './components/TableWrapper';

import useUsersStore from '../../hooks/useUsersStore';

export interface UsersTableProps extends Omit<BlockProps, 'children'> {}

function UsersTable({
	className,
	...props
}: UsersTableProps): ReactElement<UsersTableProps> {
	const loading = useUsersStore((state) => state.loading);
	const search = useUsersStore((state) => state.search);
	const type = useUsersStore((state) => state.type);
	const users = useUsersStore((state) => state.users);

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
							<TableRow key={user.id} user={user} />
						))}
					</tbody>
				</Table>
			</TableWrapper>
		) : search ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Не найдены пользователи по поиску')}
			</TableWrapper>
		) : type === 'allowed' ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('У вас нет разрешённых пользователей')}
			</TableWrapper>
		) : type === 'blocked' ? (
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
