import React, { HTMLAttributes, ReactElement } from 'react';
import { Clipboard } from 'lucide-react';

import { Variable } from '..';

import IconButton from 'components/ui/IconButton';
import Table from 'components/ui/Table';

import ClipboardButtonSlot from '../../../../ClipboardButtonSlot';

export interface TableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  variable: Variable;
}

function TableRow({ variable, ...props }: TableRowProps): ReactElement {
  return (
    <Table.Row {...props}>
      <Table.Cell className='w-1/2'>
        <div className='flex items-center gap-1'>
          <ClipboardButtonSlot variable={['SYSTEM', variable.name].join('.')}>
            <IconButton size='sm'>
              <Clipboard />
            </IconButton>
          </ClipboardButtonSlot>
          <span className='flex-auto'>{variable.name}</span>
        </div>
      </Table.Cell>
      <Table.Cell>{variable.description}</Table.Cell>
    </Table.Row>
  );
}

export default TableRow;
