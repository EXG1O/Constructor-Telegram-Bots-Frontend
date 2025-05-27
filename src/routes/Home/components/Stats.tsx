import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import PrettyNumber from 'components/ui/PrettyNumber';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

export type StatsProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Stats({ className, ...props }: StatsProps): ReactElement<StatsProps> {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'stats' });

  const { stats } = useHomeRouteLoaderData();

  return (
    <Block {...props} variant='primary' gradient>
      <h3 className='fw-semibold text-center mb-3'>{t('title')}</h3>
      <div className='flex flex-col gap-2'>
        <PrettyNumber description={t('usersTotal')}>
          {stats.users.total}
        </PrettyNumber>
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
}

export default memo(Stats);
