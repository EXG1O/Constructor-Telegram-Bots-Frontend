import React, { memo, ReactElement, useCallback } from 'react';

import Row from 'react-bootstrap/Row';

import AddButton from 'components/AddButton';
import Pagination from 'components/Pagination';
import Search, { defaultValue as searchDefaultValue } from 'components/Search';

import useVariables from '../hooks/useVariables';
import useVariableModalStore from './VariableModal/hooks/useVariableModalStore';

import { PaginationData } from '../../..';

export interface ToolbarProps {
	paginationData: Omit<PaginationData, 'results'>;
}

function Toolbar({ paginationData }: ToolbarProps): ReactElement<ToolbarProps> {
	const { updateVariables } = useVariables();

	const showAddVariableModal = useVariableModalStore((state) => state.showAdd);

	return (
		<Row md='auto' className='g-2'>
			<div>
				<AddButton size='sm' variant='dark' onClick={showAddVariableModal}>
					{gettext('Добавить переменную')}
				</AddButton>
			</div>
			<Search
				size='sm'
				className='flex-fill'
				onSearch={useCallback(
					(value) => updateVariables(undefined, undefined, value),
					[],
				)}
				onClear={useCallback(
					() => updateVariables(undefined, undefined, searchDefaultValue),
					[],
				)}
			/>
			<Pagination
				size='sm'
				itemCount={paginationData.count}
				itemLimit={paginationData.limit}
				itemOffset={paginationData.offset}
				className='justify-content-center ps-1'
				onPageChange={useCallback(
					(newOffset) => updateVariables(undefined, newOffset),
					[],
				)}
			/>
		</Row>
	);
}

export default memo(Toolbar);
