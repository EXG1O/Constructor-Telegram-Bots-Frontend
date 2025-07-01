import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import PlusButton from 'components/shared/PlusButton';
import SearchInput from 'components/shared/SearchInput';
import Pagination from 'components/ui/Pagination';

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

  function handleAddClick(): void {
    showVariableModal();
  }

  function handleSearch(value: string): void {
    updateVariables(undefined, undefined, value);
  }

  function handleCancel(): void {
    updateVariables(undefined, undefined, null);
  }

  function handlePageChange(nextOffset: number): void {
    updateVariables(undefined, nextOffset);
  }

  return (
    <div className='flex w-full flex-wrap gap-2'>
      <PlusButton
        size='sm'
        variant='dark'
        className='max-md:w-full'
        onClick={handleAddClick}
      >
        {t('addVariableButton')}
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
