import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';

import TypeTabs from './components/TypeTabs';
import VariablesTable from './components/VariablesTable';

export type Type = 'personal' | 'global';

function SystemVariables(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'system',
  });

  const [type, setType] = useState<Type>('personal');

  return (
    <Block variant='light'>
      <h3 className='mb-3 text-center text-3xl font-semibold'>{t('title')}</h3>
      <div className='flex flex-col gap-2'>
        <TypeTabs type={type} onChange={setType} />
        <VariablesTable type={type} />
      </div>
    </Block>
  );
}

export default SystemVariables;
