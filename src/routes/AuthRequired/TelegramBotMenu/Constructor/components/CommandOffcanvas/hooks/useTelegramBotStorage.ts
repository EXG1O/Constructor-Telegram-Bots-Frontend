import { useMemo } from 'react';
import { useField } from 'formik';

import useTelegramBotMenuRootRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRootRouteLoaderData';

import { Files } from '../components/FilesBlock';
import { Images } from '../components/ImagesBlock';

export interface TelegramBotStorage {
	storageSize: number;
	usedStorageSize: number;
	remainingStorageSize: number;
}

function useTelegramBotStorage(): TelegramBotStorage {
	const { telegramBot } = useTelegramBotMenuRootRouteLoaderData();

	const [{ value: images }] = useField<Images>({ name: 'images' });
	const [{ value: files }] = useField<Files>({ name: 'files' });

	const usedStorageSize = useMemo<number>(
		() =>
			telegramBot.used_storage_size +
			images.reduce((totalSize, image) => totalSize + image.size, 0) +
			files.reduce((totalSize, file) => totalSize + file.size, 0),
		[images, files],
	);
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
