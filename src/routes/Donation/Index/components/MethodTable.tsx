import React, { memo, ReactElement } from 'react';

import Table from 'components/ui/Table';

import MethodTableRow from './MethodTableRow';

import useDonationRouteLoaderData from '../hooks/useDonationRouteLoaderData';

function MethodTable(): ReactElement | null {
  const { methods } = useDonationRouteLoaderData();

  return methods.length ? (
    <div className='text-bg-white border rounded-1'>
      <Table striped className='align-middle text-nowrap'>
        <Table.Body>
          {methods.map((method, index) => (
            <MethodTableRow key={index} method={method} />
          ))}
        </Table.Body>
      </Table>
    </div>
  ) : null;
}

export default memo(MethodTable);
