import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import Table from 'components/ui/Table';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

export type DonationsProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Donations({
  className,
  ...props
}: DonationsProps): ReactElement<DonationsProps> {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'donations' });

  const { donations } = useHomeRouteLoaderData();

  return (
    <Block
      {...props}
      variant='dark'
      gradient
      className={classNames(className, 'text-center')}
    >
      <h3 className='fw-semibold mb-3'>{t('title')}</h3>
      <div className='donations-container'>
        {donations.count ? (
          <Table className='align-middle'>
            <Table.Body>
              {donations.results.map((donation) => (
                <Table.Row key={donation.id}>
                  <Table.Cell className='w-1/4'>{`${donation.sum}€`}</Table.Cell>
                  <Table.Cell className='w-1/2 text-break'>{donation.sender}</Table.Cell>
                  <Table.Cell className='w-1/2'>{formatDate(donation.date, 'd MMM yyyy')}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          t('noDonations')
        )}
      </div>
    </Block>
  );
}

export default memo(Donations);
