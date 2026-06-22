import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Tabs, { type TabsProps } from 'components/ui/Tabs';

import { useChatsBlockStore } from '../../../store';

export type Mode = 'all' | 'allowed' | 'blocked';

export interface ModeTabsProps extends Omit<
  TabsProps,
  'size' | 'value' | 'children' | 'onChange'
> {}

function ModeTabs(props: ModeTabsProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
    keyPrefix: 'chatsBlock.toolbar.modeTabs',
  });

  const mode = useChatsBlockStore((state) => state.mode);
  const updateChats = useChatsBlockStore((state) => state.updateChats);

  function handleChange(value: string): void {
    updateChats({ mode: value as Mode });
  }

  return (
    <Tabs {...props} size='sm' value={mode} onChange={handleChange}>
      <Tabs.Button value='all'>{t('all')}</Tabs.Button>
      <Tabs.Button value='allowed'>{t('allowed')}</Tabs.Button>
      <Tabs.Button value='blocked'>{t('blocked')}</Tabs.Button>
    </Tabs>
  );
}

export default ModeTabs;
