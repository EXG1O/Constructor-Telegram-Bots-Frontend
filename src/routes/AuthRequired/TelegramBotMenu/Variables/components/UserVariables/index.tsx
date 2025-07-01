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
      <Block variant='light' className='flex flex-col gap-2'>
        <Block.Title>
          <h3 className='text-3xl font-semibold'>{t('title')}</h3>
        </Block.Title>
        <Toolbar />
        <VariablesTable />
        <Footer />
      </Block>
    </>
  );
}

export default Object.assign(UserVariables, { StoreProvider });
