import React, { ReactElement } from 'react';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import BaseTelegramBotStorage, {
  TelegramBotStorageProps as BaseTelegramBotStorageProps,
} from 'components/shared/TelegramBotStorage';

import useTelegramBotStorage from '../hooks/useTelegramBotStorage';

export interface TelegramBotStorageProps
  extends Omit<
    BaseTelegramBotStorageProps,
    'size' | 'telegramBot' | 'usedStorageSize' | 'children'
  > {}

function TelegramBotStorage(props: TelegramBotStorageProps): ReactElement {
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

export default TelegramBotStorage;
