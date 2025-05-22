import React, { ReactElement } from 'react';

import { Method } from 'api/donations/types';
import Table from 'components/ui/Table';

export interface MethodTableRowProps {
  method: Method;
}

function MethodTableRow({
  method,
}: MethodTableRowProps): ReactElement<MethodTableRowProps> {
  return (
    <Table.Row>
      <Table.Head scope='row' className='text-nowrap'>{method.text}</Table.Head>
      <Table.Cell>
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
      </Table.Cell>
    </Table.Row>
  );
}

export default MethodTableRow;
