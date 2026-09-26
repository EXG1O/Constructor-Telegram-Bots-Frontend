import { redirect } from 'react-router-dom';
import i18n from 'i18n';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { type Token, UsersService } from 'api';

import reverse from 'utils/reverse';

export interface LoaderData {
  refreshTokens: Token[];
}

async function loader(): Promise<LoaderData> {
  const { data, error } = await UsersService.getTokenList({
    query: { type: 'refresh' },
  });

  if (error || !data) {
    createMessageToast({
      message: i18n.t('messages.loader.error'),
      level: 'error',
    });
    throw redirect(reverse(RouteID.Home));
  }

  return { refreshTokens: data };
}

export default loader;
