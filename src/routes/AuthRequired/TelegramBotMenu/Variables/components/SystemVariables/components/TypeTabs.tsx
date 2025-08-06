import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { TelegramBotSystemVariableType } from 'constants/telegramBotSystemVariables';

import { RouteID } from 'routes';

import Tabs, { TabsProps } from 'components/ui/Tabs';

export interface TypeTabsProps
  extends Omit<TabsProps, 'size' | 'value' | 'children' | 'onChange'> {
  type: TelegramBotSystemVariableType;
  onChange?: (type: TelegramBotSystemVariableType) => void;
}

function TypeTabs({ type, onChange, ...props }: TypeTabsProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
    keyPrefix: 'system.typeTabs',
  });

  function handleChange(value: string): void {
    onChange?.(value as TelegramBotSystemVariableType);
  }

  return (
    <Tabs {...props} size='sm' value={type} onChange={handleChange}>
      <Tabs.Button value='personal'>{t('personal')}</Tabs.Button>
      <Tabs.Button value='global'>{t('global')}</Tabs.Button>
    </Tabs>
  );
}

export default TypeTabs;
