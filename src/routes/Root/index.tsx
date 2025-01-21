import React, { ReactElement } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';

import AskConfirmModal from 'components/AskConfirmModal';
import Loading from 'components/Loading';
import ToastContainer from 'components/ToastContainer';

import Footer from './components/Footer';
import Header from './components/Header';

function Root(): ReactElement {
  const navigation = useNavigation();

  return (
    <>
      <ToastContainer />
      <AskConfirmModal />
      <Header />
      {navigation.state === 'idle' ? (
        <Outlet />
      ) : (
        <Loading size='lg' className='m-auto' />
      )}
      <Footer />
    </>
  );
}

export default Root;
