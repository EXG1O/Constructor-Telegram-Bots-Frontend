import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Loading from 'components/Loading';
import Table from 'components/Table';

import TableRow from './components/TableRow';
import TableWrapper from './components/TableWrapper';

import useUserVariablesStore from '../../hooks/useUserVariablesStore';

const tablePlaceholderClassName: string = 'text-center px-3 py-2';

function VariablesTable(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.table',
  });

  const loading = useUserVariablesStore((state) => state.loading);
  const search = useUserVariablesStore((state) => state.search);
  const variables = useUserVariablesStore((state) => state.variables);

  return !loading ? (
    variables.length ? (
      <TableWrapper className='overflow-hidden'>
        <Table responsive striped borderless className='align-middle mb-0'>
          <tbody>
            {variables.map((variable) => (
              <TableRow key={variable.id} variable={variable} />
            ))}
          </tbody>
        </Table>
      </TableWrapper>
    ) : search ? (
      <TableWrapper className={tablePlaceholderClassName}>
        {t('placeholders.notFound')}
      </TableWrapper>
    ) : (
      <TableWrapper className={tablePlaceholderClassName}>
        {t('placeholders.notAdded')}
      </TableWrapper>
    )
  ) : (
    <TableWrapper className='d-flex justify-content-center p-2'>
      <Loading size='sm' />
    </TableWrapper>
  );
}

export default memo(VariablesTable);
