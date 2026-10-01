import { redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import {
  InvoiceStatus,
  type PaginatedSubscriptionInvoiceList,
  type PremiumGetSubscriptionInvoiceListData,
  PremiumService,
  type Token,
  TokenType,
  UsersService,
} from 'api';

import reverse from 'utils/reverse';

type SubscriptionInvoiceQuery = NonNullable<
  PremiumGetSubscriptionInvoiceListData['query']
>;

export interface SubscriptionInvoicePagination
  extends
    PaginatedSubscriptionInvoiceList,
    Required<Pick<SubscriptionInvoiceQuery, 'statuses'>> {}

export interface LoaderData {
  subscriptionInvoicePagination: SubscriptionInvoicePagination;
  refreshTokens: Token[];
}

const defaultInvoiceLimit: number = 10;
const defaultInvoiceStatuses: SubscriptionInvoicePagination['statuses'] = [
  InvoiceStatus.Failed,
  InvoiceStatus.Paid,
  InvoiceStatus.Refunded,
];

async function loader(): Promise<LoaderData> {
  try {
    const invoiceResult = await PremiumService.getSubscriptionInvoiceList({
      query: { limit: defaultInvoiceLimit, statuses: defaultInvoiceStatuses },
      throwOnError: true,
    });
    const { data: refreshTokens } = await UsersService.getTokenList({
      query: { type: TokenType.Refresh },
      throwOnError: true,
    });
    return {
      subscriptionInvoicePagination: {
        ...invoiceResult.data,
        statuses: defaultInvoiceStatuses,
      },
      refreshTokens,
    };
  } catch {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }
}

export default loader;
