import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Tabs, { type TabsProps } from 'components/ui/Tabs';

import { useChatsBlockStore } from '../../../store';

export type Type = 'all' | 'private' | 'group' | 'supergroup' | 'channel';

export interface TypeTabsProps extends Omit<
  TabsProps,
  'size' | 'value' | 'children' | 'onChange'
> {}

function TypeTabs(props: TypeTabsProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'chatsBlock.toolbar.typeTabs',
  });

  const type = useChatsBlockStore((state) => state.type);
  const updateChats = useChatsBlockStore((state) => state.updateChats);

  function handleChange(value: string): void {
    updateChats({ type: value as Type });
  }

  return (
    <Tabs {...props} size='sm' value={type} onChange={handleChange}>
      <Tabs.Button value='all'>{t('all')}</Tabs.Button>
      <Tabs.Button value='private'>{t('private')}</Tabs.Button>
      <Tabs.Button value='group'>{t('group')}</Tabs.Button>
      <Tabs.Button value='supergroup'>{t('supergroup')}</Tabs.Button>
      <Tabs.Button value='channel'>{t('channel')}</Tabs.Button>
    </Tabs>
  );
}

export default TypeTabs;
