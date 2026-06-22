import React, { type HTMLAttributes, type ReactElement } from 'react';

import SearchInput from 'components/shared/SearchInput';
import Pagination from 'components/ui/Pagination';

import ModeTabs from './components/ModeTabs';

import cn from 'utils/cn';

import { useUsersBlockStore } from '../../store';

export interface BlockToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function BlockToolbar({ className, ...props }: BlockToolbarProps): ReactElement {
  const count = useUsersBlockStore((state) => state.count);
  const limit = useUsersBlockStore((state) => state.limit);
  const offset = useUsersBlockStore((state) => state.offset);
  const updateUsers = useUsersBlockStore((state) => state.updateUsers);

  function handleSearch(value: string): void {
    updateUsers({ search: value });
  }

  function handleCancel(): void {
    updateUsers({ search: null });
  }

  function handlePageChange(nextOffset: number): void {
    updateUsers({ offset: nextOffset });
  }

  return (
    <div {...props} className={cn('flex', 'w-full', 'flex-wrap', 'gap-2', className)}>
      <ModeTabs />
      <SearchInput
        size='sm'
        containerProps={{ className: 'flex-auto' }}
        onSearch={handleSearch}
        onCancel={handleCancel}
      />
      {count > limit && (
        <div className='inline-flex justify-center max-sm:w-full'>
          <Pagination
            size='sm'
            itemCount={count}
            itemLimit={limit}
            itemOffset={offset}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default BlockToolbar;
