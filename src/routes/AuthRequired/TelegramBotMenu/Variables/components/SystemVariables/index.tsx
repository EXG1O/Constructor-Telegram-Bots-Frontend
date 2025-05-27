import React, { memo, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block from 'components/ui/Block';

import TypeToggleButtonGroup from './components/TypeToggleButtonGroup';
import VariablesTable from './components/VariablesTable';

export type Type = 'personal' | 'global';

function SystemVariables(): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'system',
  });

  const [type, setType] = useState<Type>('personal');

  return (
    <Block variant='light'>
      <h3 className='fw-semibold text-center mb-3'>{t('title')}</h3>
      <div className='flex flex-col gap-2'>
        <TypeToggleButtonGroup value={type} className='col-lg-3' onChange={setType} />
        <VariablesTable type={type} />
      </div>
    </Block>
  );
}

export default memo(SystemVariables);
