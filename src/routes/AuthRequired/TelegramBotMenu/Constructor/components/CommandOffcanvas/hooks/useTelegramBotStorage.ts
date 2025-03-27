import { useMemo } from 'react';
import { useField } from 'formik';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { Documents } from '../components/DocumentsBlock';
import { Images } from '../components/ImagesBlock';

export interface TelegramBotStorage {
  storageSize: number;
  usedStorageSize: number;
  remainingStorageSize: number;
}

function useTelegramBotStorage(): TelegramBotStorage {
  const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

  const [{ value: showImages }] = useField<boolean>('show_images_block');
  const [{ value: showDocuments }] = useField<boolean>('show_documents_block');
  const [{ value: images }] = useField<Images>('images');
  const [{ value: documents }] = useField<Documents>('documents');

  const usedStorageSize = useMemo<number>(() => {
    const calcMediaSize = (media: Images | Documents): number =>
      media.reduce((totalSize, file) => totalSize + file.size, 0);

    const imagesSize: number = showImages
      ? calcMediaSize(images.filter((image) => image.file))
      : 0;
    const documentsSize: number = showDocuments
      ? calcMediaSize(documents.filter((document) => document.file))
      : 0;

    return telegramBot.used_storage_size + imagesSize + documentsSize;
  }, [showImages, showDocuments, images, documents]);

  const remainingStorageSize = useMemo<number>(
    () => telegramBot.storage_size - usedStorageSize,
    [usedStorageSize],
  );

  return {
    storageSize: telegramBot.storage_size,
    usedStorageSize,
    remainingStorageSize,
  };
}

export default useTelegramBotStorage;
