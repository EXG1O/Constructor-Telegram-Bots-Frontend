import React, { HTMLAttributes, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import TelegramBotItem from './TelegramBotItem';

import useTelegramBots from '../hooks/useTelegramBots';

import cn from 'utils/cn';

export interface TelegramBotListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function TelegramBotList({ className, ...props }: TelegramBotListProps): ReactElement {
  const { t } = useTranslation(RouteID.TelegramBots);

  const [telegramBots] = useTelegramBots();

  return (
    <div
      {...props}
      className={cn(
        'grid',
        'grid-cols-1',
        'lg:grid-cols-2',
        'xl:grid-cols-3',
        'gap-2',
        'lg:gap-3',
        className,
      )}
    >
      {telegramBots.length ? (
        telegramBots.map((telegramBot) => (
          <TelegramBotItem key={telegramBot.id} telegramBot={telegramBot} />
        ))
      ) : (
        <div className='rounded-md border border-outline px-3 py-2 text-center text-foreground'>
          {t('notTelegramBots')}
        </div>
      )}
    </div>
  );
}

export default TelegramBotList;
