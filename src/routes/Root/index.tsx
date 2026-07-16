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

import getLocationLanguage from 'utils/getLocationLanguage';
import reverse from 'utils/reverse';

function Root(): ReactElement {
  const { user } = useRootRouteLoaderData();

  const telegramBotID = useTelegramBotStore(
    (state) => state.telegramBot && state.telegramBot.id,
  );
  const setTelegramBot = useTelegramBotStore((state) => state.setTelegramBot);

  const routeLocation = useLocation();
  const routeNavigation = useNavigation();

  const location = routeNavigation.location ?? routeLocation;

  useEffect(() => {
    if (
      !telegramBotID ||
      location.pathname.startsWith(
        reverse(RouteID.TelegramBotMenuRoot, {
          params: { lang: getLocationLanguage(location), telegramBotID },
        }),
      )
    )
      return;
    setTelegramBot(null);
  }, [location, telegramBotID]);

  return (
    <>
      {user && !user.accepted_terms && <AcceptTermsModal />}
      <ConfirmModal />
      <ToastContainer />
      <Header />
      {routeNavigation.state === 'idle' ? (
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
