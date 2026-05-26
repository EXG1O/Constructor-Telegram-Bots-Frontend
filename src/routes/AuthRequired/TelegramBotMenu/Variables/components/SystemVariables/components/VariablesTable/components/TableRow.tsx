import React, { type HTMLAttributes, type ReactElement } from 'react';

import Clipboard from 'components/ui/Clipboard';
import Table from 'components/ui/Table';

import type { Variable } from '..';

export interface TableRowProps extends Omit<
  HTMLAttributes<HTMLTableRowElement>,
  'children'
> {
  variable: Variable;
}

function TableRow({ variable, ...props }: TableRowProps): ReactElement {
  return (
    <Table.Row {...props}>
      <Table.Cell className='w-1/2'>
        <div className='flex items-center gap-1'>
          <Clipboard.Button
            size='sm'
            value={`{{ ${['SYSTEM', variable.name].join('.')} }}`}
          />
          <span className='flex-auto'>{variable.name}</span>
        </div>
      </Table.Cell>
      <Table.Cell>{variable.description}</Table.Cell>
    </Table.Row>
  );
}

export default TableRow;
