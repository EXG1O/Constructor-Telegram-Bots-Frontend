import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';

import ListGroup, { ListGroupProps } from 'components/ListGroup';
import Spinner from 'components/ui/Spinner';

import RecordDisplay from './components/RecordDisplay';
import Wrapper from './components/Wrapper';

import useDatabaseRecordsStore from '../../hooks/useDatabaseRecordsStore';

export type RecordListProps = Omit<ListGroupProps, 'children'>;

const tablePlaceholderClassName: string = 'text-center px-3 py-2';

function RecordList({
  className,
  ...props
}: RecordListProps): ReactElement<RecordListProps> {
  const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
    keyPrefix: 'records.list',
  });

  const loading = useDatabaseRecordsStore((state) => state.loading);
  const search = useDatabaseRecordsStore((state) => state.search);
  const records = useDatabaseRecordsStore((state) => state.records);

  return !loading ? (
    records.length ? (
      <ListGroup {...props} className={classNames(className, 'rounded-1')}>
        {records.map((record) => (
          <RecordDisplay key={record.id} record={record} />
        ))}
      </ListGroup>
    ) : search ? (
      <Wrapper className={tablePlaceholderClassName}>
        {t('placeholders.notFound')}
      </Wrapper>
    ) : (
      <Wrapper className={tablePlaceholderClassName}>
        {t('placeholders.notAdded')}
      </Wrapper>
    )
  ) : (
    <Wrapper className='d-flex justify-content-center p-2'>
      <Spinner size='sm' />
    </Wrapper>
  );
}

export default memo(RecordList);
