import React, { ReactElement } from 'react';

import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import BaseTelegramBotStorage, {
  TelegramBotStorageProps as BaseTelegramBotStorageProps,
} from 'components/shared/TelegramBotStorage';

import { useInvoiceOffcanvasStore } from '../store';

export interface TelegramBotStorageProps extends Omit<
  BaseTelegramBotStorageProps,
  'size' | 'telegramBot' | 'usedStorageSize' | 'children'
> {}

function TelegramBotStorage(props: TelegramBotStorageProps): ReactElement {
  const telegramBot = useTelegramBotStore((state) => state.telegramBot!);
  const usedStorageSize = useInvoiceOffcanvasStore((state) => state.usedStorageSize);

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
