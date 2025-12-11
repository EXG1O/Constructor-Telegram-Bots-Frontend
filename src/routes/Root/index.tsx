import React, { ReactElement } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import ConfirmModal from 'components/shared/ConfirmModal';
import Spinner from 'components/ui/Spinner';
import ToastContainer from 'components/ui/ToastContainer';

import AcceptTermsModal from './components/AcceptTermsModal';
import Footer from './components/Footer';
import Header from './components/Header';

import useRootRouteLoaderData from './hooks/useRootRouteLoaderData';

function Root(): ReactElement {
  const { user } = useRootRouteLoaderData();

  const navigation = useNavigation();

  return (
    <>
      {!user?.accepted_terms && <AcceptTermsModal />}
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
