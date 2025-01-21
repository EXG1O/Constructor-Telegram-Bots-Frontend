import React, { ReactElement } from 'react';

import { Method } from 'api/donations/types';

export interface MethodTableRowProps {
  method: Method;
}

function MethodTableRow({
  method,
}: MethodTableRowProps): ReactElement<MethodTableRowProps> {
  return (
    <tr>
      <th className='text-nowrap'>{method.text}</th>
      <td>
        {method.link ? (
          <a
            href={method.link}
            target='_blank'
            rel='noreferrer'
            className='text-reset text-decoration-none'
          >
            {method.link}
          </a>
        ) : (
          method.value
        )}
      </td>
    </tr>
  );
}

export default MethodTableRow;
