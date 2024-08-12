import React, { memo, ReactElement } from 'react';

import Table from 'react-bootstrap/Table';

import Loading from 'components/Loading';

import TableRow from './components/TableRow';
import TableWrapper from './components/TableWrapper';

import useUserVariablesStore from '../../hooks/useUserVariablesStore';

function VariablesTable(): ReactElement {
	const loading = useUserVariablesStore((state) => state.loading);
	const search = useUserVariablesStore((state) => state.search);
	const variables = useUserVariablesStore((state) => state.variables);

	return !loading ? (
		variables.length ? (
			<TableWrapper className='overflow-hidden'>
				<Table responsive striped borderless className='align-middle mb-0'>
					<tbody>
						{variables.map((variable) => (
							<TableRow key={variable.id} variable={variable} />
						))}
					</tbody>
				</Table>
			</TableWrapper>
		) : search ? (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Не найдены переменные по поиску')}
			</TableWrapper>
		) : (
			<TableWrapper className='text-center px-3 py-2'>
				{gettext('Вы ещё не добавили переменные')}
			</TableWrapper>
		)
	) : (
		<TableWrapper className='d-flex justify-content-center p-3'>
			<Loading size='md' />
		</TableWrapper>
	);
}

export default memo(VariablesTable);
