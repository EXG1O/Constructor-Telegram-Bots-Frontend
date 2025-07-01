import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Table, { TableProps } from 'components/ui/Table';

import TableRow from './components/TableRow';

import cn from 'utils/cn';

import { Type } from '../..';

export interface VariablesTableProps
  extends Omit<TableProps, 'size' | 'striped' | 'children'> {
  type: Type;
}

export interface Variable {
  name: string;
  description: string;
}

function VariablesTable({
  type,
  className,
  ...props
}: VariablesTableProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'system.variables',
  });

  const variables = useMemo<Record<Type, Variable[]>>(
    () => ({
      personal: [
        { name: 'USER_ID', description: t('personal.userID') },
        { name: 'USER_USERNAME', description: t('personal.userUsername') },
        { name: 'USER_FIRST_NAME', description: t('personal.userFirstName') },
        { name: 'USER_LAST_NAME', description: t('personal.userLastName') },
        { name: 'USER_FULL_NAME', description: t('personal.userFullName') },
        {
          name: 'USER_LANGUAGE_CODE',
          description: t('personal.userLanguageCode'),
        },
        { name: 'USER_MESSAGE_ID', description: t('personal.userMessageID') },
        {
          name: 'USER_MESSAGE_TEXT',
          description: t('personal.userMessageText'),
        },
        {
          name: 'USER_MESSAGE_DATE',
          description: t('personal.userMessageDate'),
        },
      ],
      global: [
        { name: 'BOT_NAME', description: t('global.botName') },
        { name: 'BOT_USERNAME', description: t('global.botUsername') },
      ],
    }),
    [i18n.language],
  );

  return (
    <div className={cn('rounded-sm', 'overflow-hidden', className)}>
      <Table {...props} striped className='text-nowrap'>
        <Table.Body>
          {variables[type].map((variable) => (
            <TableRow key={variable.name} variable={variable} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default VariablesTable;
