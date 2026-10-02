import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Tabs, { type TabsProps } from 'components/ui/Tabs';

import { useChatsBlockStore } from '../../../store';

export enum Type {
  All = 'all',
  Private = 'private',
  Group = 'group',
  Supergroup = 'supergroup',
  Channel = 'channel',
}

export interface TypeTabsProps extends Omit<
  TabsProps,
  'size' | 'value' | 'children' | 'onChange'
> {}

function TypeTabs(props: TypeTabsProps): ReactElement {
  const { t } = useTranslation<`${RouteID.TelegramBotMenuUsers}`, any>(
    'telegram-bot-menu-users',
    { keyPrefix: 'chatsBlock.toolbar.typeTabs' },
  );

  const type = useChatsBlockStore((state) => state.type);
  const updateChats = useChatsBlockStore((state) => state.updateChats);

  function handleChange(value: string): void {
    updateChats({ type: value as Type });
  }

  return (
    <Tabs {...props} size='sm' value={type} onChange={handleChange}>
      {Object.values(Type).map((type) => (
        <Tabs.Button key={type} value={type}>
          {t(type)}
        </Tabs.Button>
      ))}
    </Tabs>
  );
}

export default TypeTabs;
