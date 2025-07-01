import React, { HTMLAttributes, ReactElement } from 'react';

import SearchInput from 'components/shared/SearchInput';
import Pagination from 'components/ui/Pagination';

import TypeTabs from './components/TypeTabs';

import useUsersStore from '../../hooks/useUsersStore';

import cn from 'utils/cn';

export interface ToolbarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Toolbar({ className, ...props }: ToolbarProps): ReactElement {
  const itemCount = useUsersStore((state) => state.count);
  const itemLimit = useUsersStore((state) => state.limit);
  const itemOffset = useUsersStore((state) => state.offset);
  const updateUsers = useUsersStore((state) => state.updateUsers);

  function handleSearch(value: string): void {
    updateUsers(undefined, undefined, value);
  }

  function handleCancel(): void {
    updateUsers(undefined, undefined, null);
  }

  function handlePageChange(nextOffset: number): void {
    updateUsers(undefined, nextOffset);
  }

  return (
    <div {...props} className={cn('flex', 'w-full', 'flex-wrap', 'gap-2', className)}>
      <TypeTabs />
      <SearchInput
        size='sm'
        containerProps={{ className: 'flex-auto' }}
        onSearch={handleSearch}
        onCancel={handleCancel}
      />
      {itemCount > itemLimit && (
        <div className='inline-flex justify-center max-sm:w-full'>
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
