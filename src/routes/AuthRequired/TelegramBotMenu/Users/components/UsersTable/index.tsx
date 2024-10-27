import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Loading from 'components/Loading';
import Table from 'components/Table';

import TableRow from './components/TableRow';
import TableWrapper, { BlockProps } from './components/TableWrapper';

import useUsersStore from '../../hooks/useUsersStore';

export interface UsersTableProps extends Omit<BlockProps, 'children'> {}

function UsersTable({
	className,
	...props
}: UsersTableProps): ReactElement<UsersTableProps> {
	const { t } = useTranslation('telegram-bot-menu-users', { keyPrefix: 'table' });

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
				{t('placeholders.notFound')}
			</TableWrapper>
		) : type === 'allowed' ? (
			<TableWrapper className='text-center px-3 py-2'>
				{t('placeholders.notAllowed')}
			</TableWrapper>
		) : type === 'blocked' ? (
			<TableWrapper className='text-center px-3 py-2'>
				{t('placeholders.notBlocked')}
			</TableWrapper>
		) : (
			<TableWrapper className='text-center px-3 py-2'>
				{t('placeholders.notActivated')}
			</TableWrapper>
		)
	) : (
		<TableWrapper className='d-flex justify-content-center p-3'>
			<Loading size='md' />
		</TableWrapper>
	);
}

export default UsersTable;
