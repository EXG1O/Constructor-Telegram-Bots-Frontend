import React, {
  type HTMLAttributes,
  type ReactElement,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import List from 'components/ui/List';
import Pagination from 'components/ui/Pagination';

import Loading from './Loading';
import SelectButton from './SelectButton';

import { TemporaryVariablesAPI } from 'api/telegram-bots/temporary-variable';
import type { TemporaryVariable } from 'api/telegram-bots/temporary-variable/types';

import cn from 'utils/cn';

export interface TemporaryVariablesProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

interface PaginationData {
  count: number;
  limit: number;
  offset: number;
  results: TemporaryVariable[];
}

function TemporaryVariables({
  className,
  ...props
}: TemporaryVariablesProps): ReactElement {
  const { t } = useTranslation('components', {
    keyPrefix: 'telegramBotVariablesPopover.temporaryVariables',
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

    const response = await TemporaryVariablesAPI.get(telegramBotID, limit, offset);
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
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1', className)}>
      {!loading ? (
        <List size='sm' striped>
          <ul className='w-full overflow-hidden rounded-sm text-sm'>
            {pagination.count ? (
              pagination.results.map((variable) => (
                <List.Item key={variable.id} className='flex gap-1'>
                  <span className='flex-auto overflow-x-auto scrollbar-thin'>
                    {variable.name}
                  </span>
                  <SelectButton variable={['TEMPORARY', variable.name].join('.')} />
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

export default TemporaryVariables;
