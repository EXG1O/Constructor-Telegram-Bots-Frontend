import React, { HTMLAttributes, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import List from 'components/ui/List';
import Pagination from 'components/ui/Pagination';

import Loading from './Loading';
import SelectButton from './SelectButton';

import { VariablesAPI } from 'api/telegram-bots/variable';
import { Variable } from 'api/telegram-bots/variable/types';

import cn from 'utils/cn';

export interface UserVariablesProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

interface Data {
  count: number;
  limit: number;
  offset: number;
  results: Variable[];
}

function UserVariables({ className, ...props }: UserVariablesProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotVariablesPopover.userVariables',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const [data, setData] = useState<Data>({
    count: 0,
    limit: 9,
    offset: 0,
    results: [],
  });
  const [loading, setLoading] = useState<boolean>(true);

  async function updateVariables(newLimit?: number, newOffset?: number): Promise<void> {
    setLoading(true);

    const limit = newLimit ?? data.limit;
    const offset = newOffset ?? data.offset;

    const response = await VariablesAPI.get(telegramBot.id, limit, offset);

    if (!response.ok) {
      return;
    }

    setData({ ...response.json, limit, offset });
    setLoading(false);
  }

  useEffect(() => {
    updateVariables();
  }, []);

  function handlePageChange(newOffset: number): void {
    updateVariables(undefined, newOffset);
  }

  return !loading ? (
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1.5', className)}>
      <List size='sm' striped>
        <ul className='w-full overflow-hidden rounded-sm text-sm'>
          {data.count ? (
            data.results.map((variable) => (
              <List.Item key={variable.id} className='flex gap-1'>
                <span className='flex-auto overflow-x-auto scrollbar-thin'>
                  {variable.name}
                </span>
                <SelectButton variable={`USER.${variable.name}`} />
              </List.Item>
            ))
          ) : (
            <List.Item className='text-center'>{t('placeholders.empty')}</List.Item>
          )}
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

export default UserVariables;
