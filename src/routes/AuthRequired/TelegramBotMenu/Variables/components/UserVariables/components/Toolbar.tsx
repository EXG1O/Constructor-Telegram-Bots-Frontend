import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Row from 'react-bootstrap/Row';

import AddButton from 'components/AddButton';
import Pagination from 'components/Pagination';
import Search from 'components/Search';

import useUserVariablesStore from '../hooks/useUserVariablesStore';
import useVariableModalStore from './VariableModal/hooks/useVariableModalStore';

function Toolbar(): ReactElement {
	const { t } = useTranslation('telegram-bot-menu-variables', {
		keyPrefix: 'user.toolbar',
	});

	const showAddVariableModal = useVariableModalStore((state) => state.showAdd);

	const itemCount = useUserVariablesStore((state) => state.count);
	const itemLimit = useUserVariablesStore((state) => state.limit);
	const itemOffset = useUserVariablesStore((state) => state.offset);
	const updateVariables = useUserVariablesStore((state) => state.updateVariables);

	return (
		<Row md='auto' className='g-2'>
			<div>
				<AddButton size='sm' variant='dark' onClick={showAddVariableModal}>
					{t('addVariableButton')}
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
					() => updateVariables(undefined, undefined, null),
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
