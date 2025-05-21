import React, { memo, ReactElement } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import BaseTelegramBotStorage, {
  TelegramBotStorageProps as BaseTelegramBotStorageProps,
} from 'components/shared/TelegramBotStorage';

import useTelegramBotStorage from '../hooks/useTelegramBotStorage';

export type TelegramBotStorageProps = Pick<BaseTelegramBotStorageProps, 'className'>;

function TelegramBotStorage(
  props: TelegramBotStorageProps,
): ReactElement<TelegramBotStorageProps> {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const { usedStorageSize } = useTelegramBotStorage();

  return (
    <BaseTelegramBotStorage
      {...props}
      size='sm'
      telegramBot={telegramBot}
      usedStorageSize={usedStorageSize}
    />
  );
}

export default memo(TelegramBotStorage);
