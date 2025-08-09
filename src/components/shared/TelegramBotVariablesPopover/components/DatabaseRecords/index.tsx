import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import List from 'components/ui/List';
import Pagination from 'components/ui/Pagination';

import RecordData from './components/RecordData';

import Loading from '../Loading';

import { DatabaseRecordsAPI } from 'api/telegram-bots/database-record';
import { DatabaseRecord } from 'api/telegram-bots/database-record/types';

import cn from 'utils/cn';

export interface DatabaseRecordsProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

interface Data {
  count: number;
  limit: number;
  offset: number;
  results: DatabaseRecord[];
}

function DatabaseRecords({ className, ...props }: DatabaseRecordsProps): ReactElement {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const [data, setData] = useState<Data>({
    count: 0,
    limit: 3,
    offset: 0,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  async function updateRecords(newLimit?: number, newOffset?: number): Promise<void> {
    setLoading(true);

    const limit = newLimit ?? data.limit;
    const offset = newOffset ?? data.offset;

    const response = await DatabaseRecordsAPI.get(telegramBot.id, limit, offset);

    if (!response.ok) {
      return;
    }

    setData({ ...response.json, limit, offset });
    setLoading(false);
  }

  useEffect(() => {
    updateRecords();
  }, []);

  function handlePageChange(newOffset: number): void {
    updateRecords(undefined, newOffset);
  }

  return !loading ? (
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1.5', className)}>
      <List size='sm' striped>
        <ul className='w-full overflow-hidden rounded-sm text-sm'>
          {data.results.map((record) => (
            <List.Item key={record.id}>
              <RecordData record={record} />
            </List.Item>
          ))}
        </ul>
      </List>
      <Pagination
        size='sm'
        itemCount={data.count}
        itemLimit={data.limit}
        itemOffset={data.offset}
        className='self-center'
        onPageChange={handlePageChange}
      />
    </div>
  ) : (
    <Loading {...props} className={className} />
  );
}

export default DatabaseRecords;
