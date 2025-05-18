import React, { memo, MouseEventHandler, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Row from 'react-bootstrap/Row';

import PlusButton from 'components/shared/PlusButton';
import Pagination, { PaginationProps } from 'components/Pagination';
import Search, { SearchProps } from 'components/Search';

import { useVariableModalStore } from './VariableModal/store';

import useUserVariablesStore from '../hooks/useUserVariablesStore';

type AddButtonClickHandler = MouseEventHandler<HTMLButtonElement>;
type SearchHandler = SearchProps['onSearch'];
type ClearHandler = SearchProps['onClear'];
type PageChangeHandler = PaginationProps['onPageChange'];

function Toolbar(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.toolbar',
  });

  const showVariableModal = useVariableModalStore((state) => state.showModal);

  const itemCount = useUserVariablesStore((state) => state.count);
  const itemLimit = useUserVariablesStore((state) => state.limit);
  const itemOffset = useUserVariablesStore((state) => state.offset);
  const updateVariables = useUserVariablesStore((state) => state.updateVariables);

  const handleAddButtonClick = useCallback<AddButtonClickHandler>(
    () => showVariableModal(),
    [],
  );
  const handleSearch = useCallback<SearchHandler>(
    (value) => updateVariables(undefined, undefined, value),
    [],
  );
  const handleClear = useCallback<ClearHandler>(
    () => updateVariables(undefined, undefined, null),
    [],
  );
  const handlePageChange = useCallback<PageChangeHandler>(
    (newOffset) => updateVariables(undefined, newOffset),
    [],
  );

  return (
    <Row md='auto' className='g-2'>
      <div>
        <PlusButton
          size='sm'
          variant='dark'
          className='w-100'
          onClick={handleAddButtonClick}
        >
          {t('addVariableButton')}
        </PlusButton>
      </div>
      <Search
        size='sm'
        className='flex-fill'
        onSearch={handleSearch}
        onClear={handleClear}
      />
      <Pagination
        size='sm'
        itemCount={itemCount}
        itemLimit={itemLimit}
        itemOffset={itemOffset}
        className='justify-content-center ps-1'
        onPageChange={handlePageChange}
      />
    </Row>
  );
}

export default memo(Toolbar);
