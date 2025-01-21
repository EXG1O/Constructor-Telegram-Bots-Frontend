import React, { memo, ReactElement } from 'react';

import Table from 'components/Table';

import MethodTableRow from './MethodTableRow';

import useDonationRouteLoaderData from '../hooks/useDonationRouteLoaderData';

function MethodTable(): ReactElement | null {
  const { methods } = useDonationRouteLoaderData();

  return methods.length ? (
    <div className='text-bg-white border rounded-1'>
      <Table responsive striped borderless className='align-middle text-nowrap mb-0'>
        <tbody>
          {methods.map((method, index) => (
            <MethodTableRow key={index} method={method} />
          ))}
        </tbody>
      </Table>
    </div>
  ) : null;
}

export default memo(MethodTable);
