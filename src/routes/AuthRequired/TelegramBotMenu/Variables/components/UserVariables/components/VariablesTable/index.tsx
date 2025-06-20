import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Spinner from 'components/ui/Spinner';
import Table, { TableProps } from 'components/ui/Table';

import TableRow from './components/TableRow';

import useUserVariablesStore from '../../hooks/useUserVariablesStore';

import cn from 'utils/cn';

export interface VariablesTableProps
  extends Omit<TableProps, 'size' | 'striped' | 'children'> {}

function VariablesTable({ className, ...props }: VariablesTableProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user.table',
  });

  const loading = useUserVariablesStore((state) => state.loading);
  const search = useUserVariablesStore((state) => state.search);
  const variables = useUserVariablesStore((state) => state.variables);

  return (
    <div className='overflow-hidden rounded-sm'>
      <Table {...props} striped className={cn('align-middle', className)}>
        <Table.Body>
          {!loading ? (
            variables.length ? (
              variables.map((variable) => (
                <TableRow key={variable.id} variable={variable} />
              ))
            ) : (
              <Table.Row>
                <Table.Cell className='text-center'>
                  {search ? t('placeholders.notFound') : t('placeholders.notAdded')}
                </Table.Cell>
              </Table.Row>
            )
          ) : (
            <Table.Row>
              <Table.Cell>
                <div className='flex w-full justify-center'>
                  <Spinner size='sm' />
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
}

export default VariablesTable;
