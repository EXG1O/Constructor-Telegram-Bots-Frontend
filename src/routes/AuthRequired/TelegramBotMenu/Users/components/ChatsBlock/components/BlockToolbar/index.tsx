import React, { type HTMLAttributes, type ReactElement } from 'react';

import SearchInput from 'components/shared/SearchInput';
import Pagination from 'components/ui/Pagination';

import ModeTabs from './components/ModeTabs';
import TypeTabs from './components/TypeTabs';

import cn from 'utils/cn';

import { useChatsBlockStore } from '../../store';

export interface BlockToolbarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function BlockToolbar({ className, ...props }: BlockToolbarProps): ReactElement {
  const count = useChatsBlockStore((state) => state.count);
  const limit = useChatsBlockStore((state) => state.limit);
  const offset = useChatsBlockStore((state) => state.offset);
  const updateChats = useChatsBlockStore((state) => state.updateChats);

  function handleSearch(value: string): void {
    updateChats({ search: value });
  }

  function handleCancel(): void {
    updateChats({ search: null });
  }

  function handlePageChange(nextOffset: number): void {
    updateChats({ offset: nextOffset });
  }

  return (
    <div {...props} className={cn('flex', 'w-full', 'flex-wrap', 'gap-2', className)}>
      <ModeTabs />
      <TypeTabs />
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
