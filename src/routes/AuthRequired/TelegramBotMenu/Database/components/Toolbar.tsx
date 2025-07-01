import React, { HTMLAttributes, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import PlusButton from 'components/shared/PlusButton';
import SearchInput from 'components/shared/SearchInput';
import Pagination from 'components/ui/Pagination';

import RecordAdditionModal from './RecordAdditionModal';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import cn from 'utils/cn';

export interface ToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.toolbar',
  });

  const itemCount = useDatabaseRecordsStore((state) => state.count);
  const itemLimit = useDatabaseRecordsStore((state) => state.limit);
  const itemOffset = useDatabaseRecordsStore((state) => state.offset);
  const updateRecords = useDatabaseRecordsStore((state) => state.updateRecords);

  const [showModal, setShowModal] = useState<boolean>(false);

  function handleHide(): void {
    setShowModal(false);
  }

  function handleAddClick(): void {
    setShowModal(true);
  }

  function handleSearch(value: string): void {
    updateRecords(undefined, undefined, value);
  }

  function handleCancel(): void {
    updateRecords(undefined, undefined, null);
  }

  function handlePageChange(nextOffset: number): void {
    updateRecords(undefined, nextOffset);
  }

  return (
    <div {...props} className={cn('flex', 'flex-wrap', 'w-full', 'gap-2', className)}>
      <RecordAdditionModal show={showModal} onHide={handleHide} />
      <PlusButton
        size='sm'
        variant='dark'
        className='max-md:w-full'
        onClick={handleAddClick}
      >
        {t('addRecordButton')}
      </PlusButton>
      <SearchInput
        size='sm'
        containerProps={{ className: 'flex-auto' }}
        onSearch={handleSearch}
        onCancel={handleCancel}
      />
      {itemCount > itemLimit && (
        <div className='inline-flex justify-center max-md:w-full'>
          <Pagination
            size='sm'
            itemCount={itemCount}
            itemLimit={itemLimit}
            itemOffset={itemOffset}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default Toolbar;
