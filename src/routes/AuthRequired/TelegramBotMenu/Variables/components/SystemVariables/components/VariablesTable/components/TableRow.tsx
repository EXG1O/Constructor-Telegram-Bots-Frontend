import React, { HTMLAttributes, ReactElement } from 'react';

import { Variable } from '..';

import ClipboardIcon from 'assets/icons/clipboard.svg';

export interface TableRowProps
  extends Omit<HTMLAttributes<HTMLTableRowElement>, 'children'> {
  variable: Variable;
}

function TableRow({ variable, ...props }: TableRowProps): ReactElement<TableRowProps> {
  return (
    <tr {...props}>
      <td className='w-50'>
        <div className='d-flex align-items-center gap-2'>
          <ClipboardIcon
            cursor='pointer'
            className='btn-clipboard'
            data-clipboard-text={`{{ ${variable.name} }}`}
          />
          <span className='flex-fill text-info-emphasis'>{variable.name}</span>
        </div>
      </td>
      <td className='text-nowrap'>{variable.description}</td>
    </tr>
  );
}

export default TableRow;
