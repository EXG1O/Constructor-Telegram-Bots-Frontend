import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import Tabs, { type TabsProps } from 'components/ui/Tabs';

import { useUsersBlockStore } from '../../../store';

export enum Mode {
  All = 'all',
  Allowed = 'allowed',
  Blocked = 'blocked',
}

export interface ModeTabsProps extends Omit<
  TabsProps,
  'size' | 'value' | 'children' | 'onChange'
> {}

function ModeTabs(props: ModeTabsProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuUsers}`, any>(
    'telegram-bot-menu-users',
    { keyPrefix: 'usersBlock.toolbar.modeTabs' },
  );

  const botIsPrivate = useTelegramBotStore((state) => state.telegramBot!.is_private);

  const mode = useUsersBlockStore((state) => state.mode);
  const updateUsers = useUsersBlockStore((state) => state.updateUsers);

  function handleChange(value: string): void {
    updateUsers({ mode: value as Mode });
  }

  return (
    <Tabs {...props} size='sm' value={mode} onChange={handleChange}>
      {Object.values(Mode)
        .filter((mode) => mode !== Mode.Blocked || botIsPrivate)
        .map((mode) => (
          <Tabs.Button key={mode} value={mode}>
            {t(mode as Mode)}
          </Tabs.Button>
        ))}
    </Tabs>
  );
}

export default ModeTabs;
