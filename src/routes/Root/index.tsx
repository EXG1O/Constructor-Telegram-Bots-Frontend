import React, { type ReactElement, useEffect } from 'react';
import { Outlet, useLocation, useNavigation } from 'react-router-dom';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import ConfirmModal from 'components/shared/ConfirmModal';
import Spinner from 'components/ui/Spinner';
import ToastContainer from 'components/ui/ToastContainer';

import AcceptTermsModal from './components/AcceptTermsModal';
import Footer from './components/Footer';
import Header from './components/Header';

import useRootRouteLoaderData from './hooks/useRootRouteLoaderData';

import reverse from 'utils/reverse';

function Root(): ReactElement {
  const { user } = useRootRouteLoaderData();

  const telegramBot = useTelegramBotStore((state) => state.telegramBot);
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  const location = useLocation();
  const navigation = useNavigation();

  useEffect(() => {
    if (!telegramBot) return;

    const pathname: string = navigation.location?.pathname ?? location.pathname;
    if (
      pathname.startsWith(
        reverse(RouteID.TelegramBotMenuRoot, {
          params: { telegramBotID: telegramBot.id },
        }),
      )
    )
      return;

    setTelegramBot(null);
  }, [location.pathname, navigation.location, telegramBot]);

  return (
    <>
      {user && !user.accepted_terms && <AcceptTermsModal />}
      <ConfirmModal />
      <ToastContainer />
      <Header />
      {navigation.state === 'idle' ? (
        <Outlet />
      ) : (
        <main className='flex flex-auto items-center justify-center'>
          <Spinner size='lg' />
        </main>
      )}
      <Footer />
    </>
  );
}

export default Root;
