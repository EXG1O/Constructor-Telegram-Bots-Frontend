import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import PrettyNumber from 'components/ui/PrettyNumber';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

export interface StatsProps
  extends Omit<BlockProps, 'variant' | 'gradient' | 'children'> {}

const Stats = forwardRef<HTMLDivElement, StatsProps>(({ className, ...props }, ref) => {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'stats' });

  const { stats } = useHomeRouteLoaderData();

  return (
    <Block {...props} ref={ref} variant='primary' gradient>
      <h3 className='mb-3 text-center text-3xl font-semibold'>{t('title')}</h3>
      <div className='flex flex-col gap-2'>
        <PrettyNumber description={t('usersTotal')}>{stats.users.total}</PrettyNumber>
        <PrettyNumber description={t('telegramBotsTotal')}>
          {stats.telegramBots.telegram_bots.total}
        </PrettyNumber>
        <PrettyNumber description={t('telegramBotsEnabled')}>
          {stats.telegramBots.telegram_bots.enabled}
        </PrettyNumber>
        <PrettyNumber description={t('telegramBotsUsers')}>
          {stats.telegramBots.users.total}
        </PrettyNumber>
      </div>
    </Block>
  );
});
Stats.displayName = 'Stats';

export default Stats;
