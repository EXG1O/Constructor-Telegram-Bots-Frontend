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
    <Block variant='light' className='flex flex-col gap-2'>
      <Block.Title>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      <TypeTabs type={type} onChange={setType} />
      <VariablesTable type={type} />
    </Block>
  );
}

export default SystemVariables;
