import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';
import Stack from 'components/Stack';

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
  const handleAddOrSaveVariable = useCallback(() => updateVariables(), []);

  return (
    <>
      <VariableModal onAdd={handleAddOrSaveVariable} onSave={handleAddOrSaveVariable} />
      <Block variant='light'>
        <h3 className='fw-semibold text-center mb-3'>{t('title')}</h3>
        <Stack gap={2}>
          <Toolbar />
          <VariablesTable />
          <Footer />
        </Stack>
      </Block>
    </>
  );
}

export default Object.assign(memo(UserVariables), { StoreProvider });
