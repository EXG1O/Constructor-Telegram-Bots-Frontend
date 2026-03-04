import React, {
  type HTMLAttributes,
  type ReactElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import SearchInput from 'components/shared/SearchInput';
import List from 'components/ui/List';
import Pagination from 'components/ui/Pagination';

import RecordData from './components/RecordData';

import Loading from '../Loading';

import { DatabaseRecordsAPI } from 'api/telegram-bots/database-record';
import type { DatabaseRecord } from 'api/telegram-bots/database-record/types';

import cn from 'utils/cn';

export interface DatabaseRecordsProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

interface PaginationData {
  count: number;
  limit: number;
  offset: number;
  search: string | null;
  results: DatabaseRecord[];
}

function DatabaseRecords({ className, ...props }: DatabaseRecordsProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotVariablesPopover.databaseRecords',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const [pagination, setPagination] = useState<PaginationData>({
    count: 0,
    limit: 3,
    offset: 0,
    search: null,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  async function updateRecords(
    params?: Partial<Pick<PaginationData, 'limit' | 'offset' | 'search'>>,
  ): Promise<void> {
    setLoading(true);

    const limit = params?.limit ?? pagination.limit;
    const offset = params?.offset ?? pagination.offset;
    const search =
      params && params.search !== undefined ? params.search : pagination.search;

    const response = await DatabaseRecordsAPI.get(
      telegramBotID,
      limit,
      offset,
      search ?? undefined,
    );
    if (!response.ok) return;

    setPagination({ ...response.json, limit, offset, search });
    setLoading(false);
  }

  useEffect(() => {
    updateRecords();
  }, [telegramBotID]);

  function handleSearch(value: string): void {
    updateRecords({ search: value });
  }

  function handleCancel(): void {
    updateRecords({ search: null });
  }

  function handlePageChange(offset: number): void {
    updateRecords({ offset });
  }

  return (
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1.5', className)}>
      <SearchInput size='sm' onSearch={handleSearch} onCancel={handleCancel} />
      {!loading ? (
        <List size='sm' striped>
          <ul className='w-full overflow-hidden rounded-sm text-sm'>
            {pagination.count ? (
              pagination.results.map((record) => (
                <List.Item key={record.id}>
                  <RecordData appliedSearch={pagination.search} data={record.data} />
                </List.Item>
              ))
            ) : (
              <List.Item className='text-center'>{t('placeholders.empty')}</List.Item>
            )}
          </ul>
        </List>
      ) : (
        <Loading />
      )}
      <Pagination
        size='sm'
        itemCount={pagination.count}
        itemLimit={pagination.limit}
        itemOffset={pagination.offset}
        className='self-center'
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default DatabaseRecords;
