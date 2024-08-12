import React, { memo, ReactElement, useCallback } from 'react';

import Row from 'react-bootstrap/Row';

import AddButton from 'components/AddButton';
import Pagination from 'components/Pagination';
import Search, { defaultValue as searchDefaultValue } from 'components/Search';

import useUserVariablesStore from '../hooks/useUserVariablesStore';
import useVariableModalStore from './VariableModal/hooks/useVariableModalStore';

function Toolbar(): ReactElement {
	const showAddVariableModal = useVariableModalStore((state) => state.showAdd);

	const itemCount = useUserVariablesStore((state) => state.count);
	const itemLimit = useUserVariablesStore((state) => state.limit);
	const itemOffset = useUserVariablesStore((state) => state.offset);
	const updateVariables = useUserVariablesStore((state) => state.updateVariables);

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
				itemCount={itemCount}
				itemLimit={itemLimit}
				itemOffset={itemOffset}
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
