import React, { ReactElement, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateOptions, useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';

import Page from 'components/ui/Page';
import Spinner from 'components/ui/Spinner';
import { createMessageToast } from 'components/ui/ToastContainer';

import useLoginLoaderData from './hooks/useLoginRouteLoaderData';

const navigateOptions: NavigateOptions = {
  replace: true,
};

function Login(): ReactElement {
  const { t } = useTranslation(RouteID.Login);

  const login = useLoginLoaderData();

  const navigate = useNavigate();

  useEffect(() => {
    if (!login) {
      createMessageToast({
        message: t('messages.userLogin.error'),
        level: 'error',
      });
      navigate(reverse(RouteID.Home), navigateOptions);
      return;
    }

    createMessageToast({
      message: t('messages.userLogin.success'),
      level: 'success',
    });
    navigate(reverse(RouteID.TelegramBots), navigateOptions);
  }, [login]);

  return (
    <Page title={t('title')} flex className='flex-auto items-center justify-center'>
      <Spinner />
    </Page>
  );
}

export default Login;
