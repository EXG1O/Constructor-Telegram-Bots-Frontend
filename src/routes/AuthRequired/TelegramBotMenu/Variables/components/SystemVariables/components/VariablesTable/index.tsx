import React, { ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import telegramBotSystemVariables, {
  TelegramBotSystemVariableType,
} from 'constants/telegramBotSystemVariables';

import { RouteID } from 'routes';

import Table, { TableProps } from 'components/ui/Table';

import TableRow from './components/TableRow';

import cn from 'utils/cn';

export interface VariablesTableProps
  extends Omit<TableProps, 'size' | 'striped' | 'children'> {
  type: TelegramBotSystemVariableType;
}

export interface Variable {
  name: string;
  description: string;
}

type Variables = Record<TelegramBotSystemVariableType, Variable[]>;

function VariablesTable({
  type,
  className,
  ...props
}: VariablesTableProps): ReactElement {
  const { t, i18n } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'system.variables',
  });

  const variables = useMemo<Variables>(
    () =>
      Object.keys(telegramBotSystemVariables).reduce<Variables>((acc, value) => {
        const type = value as TelegramBotSystemVariableType;
        acc[type] = telegramBotSystemVariables[type].map((variable) => ({
          name: variable,
          description: t(`${type}.${variable}`),
        }));
        return acc;
      }, {} as Variables),
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
