import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Row from 'react-bootstrap/Row';

import AddButton from 'components/AddButton';
import Pagination from 'components/Pagination';
import Search from 'components/Search';

import { useVariableModalStore } from './VariableModal/store';

import useUserVariablesStore from '../hooks/useUserVariablesStore';

function Toolbar(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.toolbar',
	});

	const showVariableModal = useVariableModalStore((state) => state.showModal);

	const itemCount = useUserVariablesStore((state) => state.count);
	const itemLimit = useUserVariablesStore((state) => state.limit);
	const itemOffset = useUserVariablesStore((state) => state.offset);
	const updateVariables = useUserVariablesStore((state) => state.updateVariables);

	const handleAddButtonClick = useCallback(() => showVariableModal(), []);

	return (
		<Row md='auto' className='g-2'>
			<div>
				<AddButton size='sm' variant='dark' onClick={handleAddButtonClick}>
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
