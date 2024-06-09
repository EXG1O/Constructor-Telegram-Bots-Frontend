import React, { ReactElement, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import BaseTelegramBotStorage, {
	TelegramBotStorageProps as BaseTelegramBotStorageProps,
} from 'components/TelegramBotStorage';

import useTelegramBotStorage from '../hooks/useTelegramBotStorage';

import { LoaderData as TelegramBotMenuRootLoaderData } from 'routes/AuthRequired/TelegramBotMenu/Root';

export type TelegramBotStorageProps = Omit<
	BaseTelegramBotStorageProps,
	'telegramBot' | 'usedStorageSize'
>;

function TelegramBotStorage(
	props: TelegramBotStorageProps,
): ReactElement<TelegramBotStorageProps> {
	const { telegramBot } = useRouteLoaderData(
		'telegram-bot-menu-root',
	) as TelegramBotMenuRootLoaderData;

	const { usedStorageSize } = useTelegramBotStorage();

	return (
		<BaseTelegramBotStorage
			{...props}
			telegramBot={telegramBot}
			usedStorageSize={usedStorageSize}
		/>
	);
}

export default memo(TelegramBotStorage);
