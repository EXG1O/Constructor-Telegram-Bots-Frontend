import { redirect } from 'react-router-dom';
import i18n from 'i18n';
import type { TOptions } from 'i18next';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { PremiumService, type SubscriptionPrice } from 'api';

import reverse from 'utils/reverse';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.Premium}`;
}

export interface LoaderData {
  prices: SubscriptionPrice[];
}

async function loader(): Promise<LoaderData> {
  const { data, error } = await PremiumService.getSubscriptionPriceList();

  if (error || !data) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  if (data.length === 0) {
    await i18n.loadNamespaces(RouteID.Premium);
    createMessageToast({
      message: i18n.t<string, StrictTOptions, string, StrictTOptions>(
        'messages.getPrices.error',
        { ns: 'premium', context: 'empty' },
      ),
      level: 'info',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { prices: data };
}

export default loader;
