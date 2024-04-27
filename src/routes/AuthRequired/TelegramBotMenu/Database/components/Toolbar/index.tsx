import React, { ReactElement, HTMLAttributes, memo, useCallback } from 'react';
import classNames from 'classnames';

import Search, { defaultValue as searchDefaultValue } from 'components/Search';
import Pagination from 'components/Pagination';

import AddRecordButton from './components/AddRecordButton';

import useRecords from '../../hooks/useRecords';

import { PaginationData } from '../..';

export interface ToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	paginationData: Omit<PaginationData, 'results'>;
}

function Toolbar({ paginationData, className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
	const { updateRecords } = useRecords();

	return (
		<div {...props} className={classNames('row row-cols-lg-auto g-2', className)}>
			<div>
				<AddRecordButton
					size='sm'
					className='w-100'
				/>
			</div>
			<Search
				size='sm'
				className='flex-fill'
				onSearch={useCallback(search => updateRecords(undefined, undefined, search), [])}
				onClear={useCallback(() => updateRecords(undefined, undefined, searchDefaultValue), [])}
			/>
			<Pagination
				size='sm'
				itemCount={paginationData.count}
				itemLimit={paginationData.limit}
				itemOffset={paginationData.offset}
				className='justify-content-center ps-1'
				onPageChange={useCallback(newOffset => updateRecords(undefined, newOffset), [])}
			/>
		</div>
	);
}

export default memo(Toolbar);