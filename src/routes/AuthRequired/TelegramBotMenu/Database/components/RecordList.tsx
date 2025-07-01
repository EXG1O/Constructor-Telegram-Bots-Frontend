import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';

import RecordItem from './RecordItem';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

import cn from 'utils/cn';

export interface RecordListProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {}

function RecordList({ className, ...props }: RecordListProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.list',
  });

  const loading = useDatabaseRecordsStore((state) => state.loading);
  const search = useDatabaseRecordsStore((state) => state.search);
  const records = useDatabaseRecordsStore((state) => state.records);

  return (
    <ul
      {...props}
      className={cn(
        'flex',
        'flex-col',
        'w-full',
        'bg-light-accent',
        'rounded-sm',
        'p-2',
        'gap-2',
        className,
      )}
    >
      {!loading ? (
        records.length ? (
          records.map((record) => <RecordItem key={record.id} record={record} />)
        ) : (
          <li className='w-full text-center'>
            {search ? t('placeholders.notFound') : t('placeholders.notAdded')}
          </li>
        )
      ) : (
        <li className='flex w-full justify-center'>
          <Spinner size='sm' />
        </li>
      )}
    </ul>
  );
}

export default RecordList;
