import React, { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import type { RouteID } from 'routes';

import Block, { type BlockProps } from 'components/ui/Block';
import PrettyNumber from 'components/ui/PrettyNumber';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

import cn from 'utils/cn';

export interface StatsProps extends Omit<
  BlockProps,
  'size' | 'variant' | 'gradient' | 'children'
> {}

function Stats({ className, ...props }: StatsProps): ReactElement {
  const { t } = useTranslation<`${RouteID.Home}`, any>('home', { keyPrefix: 'stats' });

  const { stats } = useHomeRouteLoaderData();

  return (
    <Block
      {...props}
      size='xl'
      variant='dark'
      gradient
      className={cn('flex', 'flex-col', className)}
    >
      <Block.Title>
        <h3 className='text-3xl font-semibold'>{t('title')}</h3>
      </Block.Title>
      <div className='flex flex-auto flex-col justify-center gap-2'>
        <PrettyNumber description={t('users.total')}>{stats.users.total}</PrettyNumber>
        <PrettyNumber description={t('telegramBots.total')}>
          {stats.telegramBots.telegram_bots.total}
        </PrettyNumber>
        <PrettyNumber description={t('telegramBots.enabled')}>
          {stats.telegramBots.telegram_bots.enabled}
        </PrettyNumber>
        <PrettyNumber description={t('telegramBots.users')}>
          {stats.telegramBots.users.total}
        </PrettyNumber>
      </div>
    </Block>
  );
}

export default Stats;
