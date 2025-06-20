import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';

import Footer from './components/Footer';
import Toolbar from './components/Toolbar';
import VariableModal from './components/VariableModal';
import VariablesTable from './components/VariablesTable';
import StoreProvider from './providers/StoreProvider';

import useUserVariablesStore from './hooks/useUserVariablesStore';

function UserVariables(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'user',
  });

  const updateVariables = useUserVariablesStore((state) => state.updateVariables);

  function handleApply(): void {
    updateVariables();
  }

  return (
    <>
      <VariableModal onAdd={handleApply} onSave={handleApply} />
      <Block variant='light'>
        <h3 className='mb-3 text-center text-3xl font-semibold'>{t('title')}</h3>
        <div className='flex flex-col gap-2'>
          <Toolbar />
          <VariablesTable />
          <Footer />
        </div>
      </Block>
    </>
  );
}

export default Object.assign(UserVariables, { StoreProvider });
