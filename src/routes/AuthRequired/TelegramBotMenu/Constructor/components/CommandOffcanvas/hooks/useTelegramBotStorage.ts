import { useMemo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import useCommandOffcanvasStore from './useCommandOffcanvasStore';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

export interface TelegramBotStorage {
	storageSize: number;
	usedStorageSize: number;
	remainingStorageSize: number;
}

function useTelegramBotStorage(): TelegramBotStorage {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const images = useCommandOffcanvasStore((state) => state.images);
	const files = useCommandOffcanvasStore((state) => state.files);

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
