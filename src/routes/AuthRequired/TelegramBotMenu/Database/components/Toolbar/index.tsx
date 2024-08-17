import React, { HTMLAttributes, memo, ReactElement, useCallback } from 'react';
import classNames from 'classnames';

import Pagination from 'components/Pagination';
import Search, { defaultValue as searchDefaultValue } from 'components/Search';

import AddRecordButton from './components/AddRecordButton';

import useDatabaseRecordsStore from '../../hooks/useDatabaseRecordsStore';

export interface ToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
	const itemCount = useDatabaseRecordsStore((state) => state.count);
	const itemLimit = useDatabaseRecordsStore((state) => state.limit);
	const itemOffset = useDatabaseRecordsStore((state) => state.offset);
	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	return (
		<div {...props} className={classNames('row row-cols-lg-auto g-2', className)}>
			<div>
				<AddRecordButton size='sm' className='w-100' />
			</div>
			<Search
				size='sm'
				className='flex-fill'
				onSearch={useCallback(
					(search) => updateRecords(undefined, undefined, search),
					[],
				)}
				onClear={useCallback(
					() => updateRecords(undefined, undefined, searchDefaultValue),
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
					(newOffset) => updateRecords(undefined, newOffset),
					[],
				)}
			/>
		</div>
	);
}

export default memo(Toolbar);
