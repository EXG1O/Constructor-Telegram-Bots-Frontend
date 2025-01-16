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

	const [{ value: showImages }] = useField<boolean>('show_images_block');
	const [{ value: showFiles }] = useField<boolean>('show_files_block');
	const [{ value: images }] = useField<Images>('images');
	const [{ value: files }] = useField<Files>('files');

	const usedStorageSize = useMemo<number>(() => {
		const calcMediaSize = (media: Images | Files): number =>
			media.reduce((totalSize, file) => totalSize + file.size, 0);

		const imagesSize: number = showImages
			? calcMediaSize(images.filter((image) => image.image))
			: 0;
		const filesSize: number = showFiles
			? calcMediaSize(files.filter((file) => file.file))
			: 0;

		return telegramBot.used_storage_size + imagesSize + filesSize;
	}, [showImages, showFiles, images, files]);

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
