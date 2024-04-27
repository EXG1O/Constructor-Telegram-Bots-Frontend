import React, { ReactElement, HTMLAttributes, memo, useCallback } from 'react';
import classNames from 'classnames';

import Search, { defaultValue as searchDefaultValue } from 'components/Search';
import Pagination from 'components/Pagination';

import TypeToggleButtonGroup from './components/TypeToggleButtonGroup';

import useUsers from '../../hooks/useUsers';

import { PaginationData } from '../..';

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	paginationData: Omit<PaginationData, 'results'>;
}

function Toolbar({ paginationData, className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
	const { updateUsers } = useUsers();

	return (
		<div {...props} className={classNames('row row-cols-lg-auto g-2', className)}>
			<TypeToggleButtonGroup />
			<Search
				size='sm'
				className='flex-fill'
				onSearch={useCallback(value => updateUsers(undefined, undefined, value), [])}
				onClear={useCallback(() => updateUsers(undefined, undefined, searchDefaultValue), [])}
			/>
			<Pagination
				itemCount={paginationData.count}
				itemLimit={paginationData.limit}
				itemOffset={paginationData.offset}
				size='sm'
				className='justify-content-center ps-1'
				onPageChange={useCallback(newOffset => updateUsers(undefined, newOffset), [])}
			/>
		</div>
	);
}

export default memo(Toolbar);