import React, { ReactElement } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import ConfirmModal from 'components/shared/ConfirmModal';
import Spinner from 'components/ui/Spinner';
import ToastContainer from 'components/ui/ToastContainer';

import Footer from './components/Footer';
import Header from './components/Header';

function Root(): ReactElement {
  const navigation = useNavigation();

  return (
    <>
      <ToastContainer />
      <ConfirmModal />
      <Header />
      {navigation.state === 'idle' ? (
        <Outlet />
      ) : (
        <Spinner size='lg' className='m-auto' />
      )}
      <Footer />
    </>
  );
}

export default Root;
