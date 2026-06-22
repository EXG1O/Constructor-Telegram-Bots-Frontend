import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Tabs, { type TabsProps } from 'components/ui/Tabs';

import { useUsersBlockStore } from '../../../store';

export type Mode = 'all' | 'allowed' | 'blocked';

export interface ModeTabsProps extends Omit<
  TabsProps,
  'size' | 'value' | 'children' | 'onChange'
> {}

function ModeTabs(props: ModeTabsProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'usersBlock.toolbar.modeTabs',
  });

  const botIsPrivate = useTelegramBotStore((state) => state.telegramBot!.is_private);

  const mode = useUsersBlockStore((state) => state.mode);
  const updateUsers = useUsersBlockStore((state) => state.updateUsers);

  function handleChange(value: string): void {
    updateUsers({ mode: value as Mode });
  }

  return (
    <Tabs {...props} size='sm' value={mode} onChange={handleChange}>
      <Tabs.Button value='all'>{t('all')}</Tabs.Button>
      {botIsPrivate && <Tabs.Button value='allowed'>{t('allowed')}</Tabs.Button>}
      <Tabs.Button value='blocked'>{t('blocked')}</Tabs.Button>
    </Tabs>
  );
}

export default ModeTabs;
