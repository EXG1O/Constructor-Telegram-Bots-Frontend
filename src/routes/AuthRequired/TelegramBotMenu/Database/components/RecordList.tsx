import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import List from 'components/ui/List';
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
    <List striped>
      <ol
        {...props}
        className={cn('w-full', 'rounded-sm', 'overflow-hidden', className)}
      >
        {!loading ? (
          records.length ? (
            records.map((record) => <RecordItem key={record.id} record={record} />)
          ) : (
            <List.Item className='text-center'>
              {search ? t('placeholders.notFound') : t('placeholders.notAdded')}
            </List.Item>
          )
        ) : (
          <List.Item className='flex justify-center'>
            <Spinner size='sm' />
          </List.Item>
        )}
      </ol>
    </List>
  );
}

export default RecordList;
