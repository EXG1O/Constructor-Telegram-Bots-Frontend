import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import Table from 'components/ui/Table';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

import cn from 'utils/cn';

export interface DonationsProps
  extends Omit<BlockProps, 'variant' | 'gradient' | 'children'> {}

function Donations({ className, ...props }: DonationsProps): ReactElement {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'donations' });

  const { donations } = useHomeRouteLoaderData();

  return (
    <Block
      {...props}
      size='xl'
      variant='dark'
      gradient
      className={cn('flex', 'flex-col', 'text-center', 'gap-3', className)}
    >
      <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      {donations.count ? (
        <Table className='align-middle'>
          <Table.Body>
            {donations.results.map((donation) => (
              <Table.Row key={donation.id}>
                <Table.Cell className='w-1/4'>{`${donation.sum}€`}</Table.Cell>
                <Table.Cell className='w-1/2'>{donation.sender}</Table.Cell>
                <Table.Cell className='w-1/2'>
                  {formatDate(donation.date, 'd MMM yyyy')}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <span>{t('noDonations')}</span>
      )}
    </Block>
  );
}

export default Donations;
