import React, { ReactElement } from 'react';

import Table, { TableProps } from 'components/ui/Table';

import useDonationRouteLoaderData from '../hooks/useDonationRouteLoaderData';

import cn from 'utils/cn';

export interface MethodTableProps extends Omit<TableProps, 'children'> {}

function MethodTable({ className, ...props }: MethodTableProps): ReactElement | null {
  const { methods } = useDonationRouteLoaderData();

  return methods.length ? (
    <div
      {...props}
      className={cn(
        'block',
        'w-full',
        'bg-light',
        'text-foreground',
        'border',
        'border-outline',
        'rounded-md',
        'overflow-hidden',
        className,
      )}
    >
      <Table striped className='text-nowrap'>
        <Table.Body>
          {methods.map((method, index) => (
            <Table.Row key={index}>
              <Table.Head scope='row'>{method.text}</Table.Head>
              <Table.Cell>
                {method.link ? (
                  <a
                    href={method.link}
                    target='_blank'
                    rel='noreferrer'
                    className='text-primary hover:text-primary-accent'
                  >
                    {method.link}
                  </a>
                ) : (
                  <span className='select-all'>{method.value}</span>
                )}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  ) : null;
}

export default MethodTable;
