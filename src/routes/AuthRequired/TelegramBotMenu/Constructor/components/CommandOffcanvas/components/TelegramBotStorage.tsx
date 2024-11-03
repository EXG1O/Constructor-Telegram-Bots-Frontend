import React, { memo, ReactElement } from 'react';

import useTelegramBotMenuRouteLoaderData from 'routes/AuthRequired/TelegramBotMenu/Root/hooks/useTelegramBotMenuRouteLoaderData';

import BaseTelegramBotStorage, {
	TelegramBotStorageProps as BaseTelegramBotStorageProps,
} from 'components/TelegramBotStorage';

import useTelegramBotStorage from '../hooks/useTelegramBotStorage';

export type TelegramBotStorageProps = Omit<
	BaseTelegramBotStorageProps,
	'telegramBot' | 'usedStorageSize'
>;

function TelegramBotStorage(
	props: TelegramBotStorageProps,
): ReactElement<TelegramBotStorageProps> {
	const { telegramBot } = useTelegramBotMenuRouteLoaderData();

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
