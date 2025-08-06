import React, { ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TelegramBotSystemVariablesType } from 'constants/telegramBotSystemVariables';

import { RouteID } from 'routes';

import TelegramBotSystemVariablesTypeTabs from 'components/shared/TelegramBotSystemVariablesTypeTabs';
import Block from 'components/ui/Block';

import VariablesTable from './components/VariablesTable';

function SystemVariables(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'system',
  });

  const [type, setType] = useState<TelegramBotSystemVariablesType>('personal');

  return (
    <Block variant='light' className='flex flex-col gap-2'>
      <Block.Title>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      <TelegramBotSystemVariablesTypeTabs size='sm' type={type} onChange={setType} />
      <VariablesTable type={type} />
    </Block>
  );
}

export default SystemVariables;
