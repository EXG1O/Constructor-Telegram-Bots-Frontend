import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import List from 'components/ui/List';
import Pagination from 'components/ui/Pagination';

import Loading from './Loading';
import SelectButton from './SelectButton';

import { VariablesAPI } from 'api/telegram-bots/variable';
import { Variable } from 'api/telegram-bots/variable/types';

import cn from 'utils/cn';

export interface UserVariablesProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

interface PaginationData {
  count: number;
  limit: number;
  offset: number;
  results: Variable[];
}

function UserVariables({ className, ...props }: UserVariablesProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotVariablesPopover.userVariables',
  });

  const telegramBotID = useTelegramBotStore((state) => state.telegramBot!.id);

  const [pagination, setPagination] = useState<PaginationData>({
    count: 0,
    limit: 9,
    offset: 0,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  async function updateVariables(
    params?: Partial<Pick<PaginationData, 'limit' | 'offset'>>,
  ): Promise<void> {
    setLoading(true);

    const limit = params?.limit ?? pagination.limit;
    const offset = params?.offset ?? pagination.offset;

    const response = await VariablesAPI.get(telegramBotID, limit, offset);
    if (!response.ok) return;

    setPagination({ ...response.json, limit, offset });
    setLoading(false);
  }

  useEffect(() => {
    updateVariables();
  }, [telegramBotID]);

  function handlePageChange(offset: number): void {
    updateVariables({ offset });
  }

  return (
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1.5', className)}>
      {!loading ? (
        <List size='sm' striped>
          <ul className='w-full overflow-hidden rounded-sm text-sm'>
            {pagination.count ? (
              pagination.results.map((variable) => (
                <List.Item key={variable.id} className='flex gap-1'>
                  <span className='flex-auto overflow-x-auto scrollbar-thin'>
                    {variable.name}
                  </span>
                  <SelectButton variable={['USER', variable.name].join('.')} />
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

export default UserVariables;
