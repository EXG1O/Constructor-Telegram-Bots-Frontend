import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import Tabs, { TabsProps } from 'components/ui/Tabs';

import useUsersStore from '../../../hooks/useUsersStore';

import { StateParams } from '../../../store';

export interface TypeTabsProps
  extends Omit<TabsProps, 'size' | 'value' | 'children' | 'onChange'> {}

function TypeTabs(props: TypeTabsProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'toolbar.typeTabs',
  });

  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const type = useUsersStore((state) => state.type);
  const updateUsers = useUsersStore((state) => state.updateUsers);

  function handleChange(value: string): void {
    updateUsers(undefined, undefined, undefined, value as StateParams['type']);
  }

  return (
    <Tabs {...props} size='sm' value={type} onChange={handleChange}>
      <Tabs.Button value='all'>{t('all')}</Tabs.Button>
      {telegramBot && <Tabs.Button value='allowed'>{t('allowed')}</Tabs.Button>}
      <Tabs.Button value='blocked'>{t('blocked')}</Tabs.Button>
    </Tabs>
  );
}

export default TypeTabs;
