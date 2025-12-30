import { useField } from 'formik';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { FormValues } from '..';

export interface TelegramBotStorage {
  storageSize: number;
  usedStorageSize: number;
  remainingStorageSize: number;
}

function useTelegramBotStorage(): TelegramBotStorage {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const [{ value: showImage }] = useField<boolean>('show_image_block');
  const [{ value: image }] = useField<FormValues['image']>('image');

  const usedStorageSize: number =
    telegramBot.used_storage_size + (showImage && image ? image.size : 0);

  return {
    storageSize: telegramBot.storage_size,
    usedStorageSize,
    remainingStorageSize: telegramBot.storage_size - usedStorageSize,
  };
}

export default useTelegramBotStorage;
