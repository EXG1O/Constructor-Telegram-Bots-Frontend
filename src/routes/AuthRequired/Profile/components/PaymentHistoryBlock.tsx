import React, { type ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import formatDate from 'i18n/formatDate';
import { Star } from 'lucide-react';

import type { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';
import Pagination from 'components/ui/Pagination';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';
import { createMessageToast } from 'components/ui/ToastContainer';

import useProfileRouteLoaderData from '../hooks/useProfileRouteLoaderData';

import { type InvoiceStatus, PremiumService } from 'api';

import cn from 'utils/cn';

import type { SubscriptionInvoicePagination } from '../loader';

export interface PaymentHistoryBlockProps extends Omit<
  BlockProps,
  'size' | 'variant' | 'children'
> {}

function PaymentHistoryBlock({
  className,
  ...props
}: PaymentHistoryBlockProps): ReactElement {
  const { t } = useTranslation<`${RouteID.Profile}`, any>('profile', {
    keyPrefix: 'paymentHistoryBlock',
  });

  const { subscriptionInvoicePagination: initialInvoicePagination } =
    useProfileRouteLoaderData();

  const [invoicePagination, setInvoicePagination] =
    useState<SubscriptionInvoicePagination>(initialInvoicePagination);
  const [loading, setLoading] = useState<boolean>(false);

  async function handlePageChange(nextOffset: number): Promise<void> {
    setLoading(true);

    const { data, error } = await PremiumService.getSubscriptionInvoiceList({
      query: {
        limit: invoicePagination.limit,
        offset: nextOffset,
        statuses: invoicePagination.statuses,
      },
    });

    if (error || !data) {
      createMessageToast({
        message: t('messages.getInvoices.error'),
        level: 'error',
      });
    } else {
      setInvoicePagination((prevPagination) => ({ ...prevPagination, ...data }));
    }

    setLoading(false);
  }

  return (
    <Block
      {...props}
      variant='light'
      className={cn('flex', 'flex-col', 'gap-2', className)}
    >
      <Block.Title>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      {invoicePagination.count > invoicePagination.limit && (
        <div className='inline-flex justify-center max-sm:w-full'>
          <Pagination
            size='sm'
            itemCount={invoicePagination.count}
            itemLimit={invoicePagination.limit}
            itemOffset={invoicePagination.offset}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <div className='w-full overflow-hidden rounded-md'>
        <Table striped className='text-nowrap'>
          {!loading ? (
            invoicePagination.count ? (
              <>
                <Table.Header>
                  <Table.Row>
                    <Table.Head>ID</Table.Head>
                    <Table.Head>{t('table.status.header')}</Table.Head>
                    <Table.Head>{t('table.period.header')}</Table.Head>
                    <Table.Head>{t('table.amount.header')}</Table.Head>
                    <Table.Head>Telegram Charge ID</Table.Head>
                    <Table.Head>{t('table.paidDate.header')}</Table.Head>
                    <Table.Head>{t('table.createdDate.header')}</Table.Head>
                  </Table.Row>
                </Table.Header>
                <Table.Body className='text-center'>
                  {invoicePagination.results.map((invoice) => (
                    <Table.Row key={invoice.id}>
                      <Table.Cell>{invoice.id}</Table.Cell>
                      <Table.Cell>
                        {t(`table.status.values.${invoice.status as InvoiceStatus}`)}
                      </Table.Cell>
                      <Table.Cell>
                        {t('table.period.months', { count: invoice.period_months })}
                      </Table.Cell>
                      <Table.Cell>
                        <div className='flex items-center justify-center gap-1'>
                          <span>{invoice.amount_stars}</span>
                          <Star className='size-4 fill-warning text-warning' />
                        </div>
                      </Table.Cell>
                      <Table.Cell className='min-w-75 text-wrap break-all select-all'>
                        {invoice.telegram_charge_id || '-'}
                      </Table.Cell>
                      <Table.Cell>
                        {invoice.paid_date ? formatDate(invoice.paid_date) : '-'}
                      </Table.Cell>
                      <Table.Cell>{formatDate(invoice.created_date)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </>
            ) : (
              <Table.Body className='text-center'>
                <Table.Row>
                  <Table.Cell>{t('placeholders.empty')}</Table.Cell>
                </Table.Row>
              </Table.Body>
            )
          ) : (
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <div className='flex w-full justify-center'>
                    <Spinner size='sm' />
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )}
        </Table>
      </div>
      {!loading && Boolean(invoicePagination.count) && (
        <small className='w-full text-end text-xs text-muted'>
          {t('footer.count', { count: initialInvoicePagination.count })}
        </small>
      )}
    </Block>
  );
}

export default PaymentHistoryBlock;
