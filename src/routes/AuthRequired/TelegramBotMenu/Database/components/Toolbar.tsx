import React, { HTMLAttributes, memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import AddButton from 'components/AddButton';
import Pagination from 'components/Pagination';
import Search, { defaultValue as searchDefaultValue } from 'components/Search';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';
import useRecordModalStore from './RecordModal/hooks/useRecordModalStore';

export interface ToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
	const { t } = useTranslation('telegram-bot-menu-database', {
		keyPrefix: 'records.toolbar',
	});

	const itemCount = useDatabaseRecordsStore((state) => state.count);
	const itemLimit = useDatabaseRecordsStore((state) => state.limit);
	const itemOffset = useDatabaseRecordsStore((state) => state.offset);
	const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

	const showAddRecordModal = useRecordModalStore((state) => state.showAdd);

	return (
		<div {...props} className={classNames('row row-cols-lg-auto g-2', className)}>
			<div>
				<AddButton
					size='sm'
					variant='dark'
					className='w-100'
					onClick={showAddRecordModal}
				>
					{t('addRecordButton')}
				</AddButton>
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
