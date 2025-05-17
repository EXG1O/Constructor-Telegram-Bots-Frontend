import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/ui/Block';
import InfoArea from 'components/InfoArea';
import Stack from 'components/Stack';

import useHomeRouteLoaderData from '../hooks/useHomeRouteLoaderData';

export type StatsProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Stats({ className, ...props }: StatsProps): ReactElement<StatsProps> {
  const { t } = useTranslation(RouteID.Home, { keyPrefix: 'stats' });

  const { stats } = useHomeRouteLoaderData();

  return (
    <Block {...props} variant='primary' gradient>
      <h3 className='fw-semibold text-center mb-3'>{t('title')}</h3>
      <Stack gap={2}>
        <InfoArea number={stats.users.total} description={t('usersTotal')} />
        <InfoArea
          number={stats.telegramBots.telegram_bots.total}
          description={t('telegramBotsTotal')}
        />
        <InfoArea
          number={stats.telegramBots.telegram_bots.enabled}
          description={t('telegramBotsEnabled')}
        />
        <InfoArea
          number={stats.telegramBots.users.total}
          description={t('telegramBotsUsers')}
        />
      </Stack>
    </Block>
  );
}

export default memo(Stats);
