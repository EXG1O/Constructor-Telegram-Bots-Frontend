import React, { HTMLAttributes, memo, ReactElement, useCallback } from 'react';
import classNames from 'classnames';

import Pagination, { PaginationProps } from 'components/ui/Pagination';
import SearchInput, { SearchInputProps} from 'components/shared/SearchInput';

import TypeToggleButtonGroup from './components/TypeToggleButtonGroup';

import useUsersStore from '../../hooks/useUsersStore';

export interface ToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

type SearchHandler = NonNullable<SearchInputProps['onSearch']>;
type CancelHandler = NonNullable<SearchInputProps['onCancel']>;
type PageChangeHandler = PaginationProps['onPageChange'];

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
  const itemCount = useUsersStore((state) => state.count);
  const itemLimit = useUsersStore((state) => state.limit);
  const itemOffset = useUsersStore((state) => state.offset);
  const updateUsers = useUsersStore((state) => state.updateUsers);

  const handleSearch = useCallback<SearchHandler>(
    (value) => updateUsers(undefined, undefined, value),
    [],
  );
  const handleCancel = useCallback<CancelHandler>(
    () => updateUsers(undefined, undefined, null),
    [],
  );
  const handlePageChange = useCallback<PageChangeHandler>(
    (newOffset) => updateUsers(undefined, newOffset),
    [],
  );
  return (
    <div {...props} className={classNames('row row-cols-lg-auto g-2', className)}>
      <TypeToggleButtonGroup />
      <SearchInput
        size='sm'
        className='flex-fill'
        onSearch={handleSearch}
        onCancel={handleCancel}
      />
      <Pagination
        size='sm'
        itemCount={itemCount}
        itemLimit={itemLimit}
        itemOffset={itemOffset}
        className='justify-content-center ps-1'
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default memo(Toolbar);
