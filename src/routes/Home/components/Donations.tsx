import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import formatDate from 'i18n/formatDate';

import { RouteID } from 'routes';

import './Donations.scss';

import Block, { BlockProps } from 'components/Block';
import Table from 'components/Table';

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
      <div className='donations-container overflow-y-auto'>
        {donations.count ? (
          <Table borderless className='align-middle mb-0'>
            <tbody>
              {donations.results.map((donation) => (
                <tr key={donation.id}>
                  <td className='sum'>{`${donation.sum}€`}</td>
                  <td className='sender text-break'>{donation.sender}</td>
                  <td className='date'>{formatDate(donation.date, 'd MMM yyyy')}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          t('noDonations')
        )}
      </div>
    </Block>
  );
}

export default memo(Donations);
