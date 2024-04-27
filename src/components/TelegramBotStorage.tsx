import React, { ReactElement, HTMLAttributes, memo } from 'react';
import classNames from 'classnames';

import ProgressBar from 'react-bootstrap/ProgressBar';

import { TelegramBot } from 'services/api/telegram_bots/types';

type Size = 'sm' | 'lg';

export interface TelegramBotStorageProps extends HTMLAttributes<HTMLDivElement> {
	size?: Size
	telegramBot: TelegramBot;
	usedStorageSize?: number;
}

const fontSizes: Record<Size, number> = { sm: 14, lg: 18 };

function TelegramBotStorage({
	size,
	telegramBot,
	usedStorageSize = telegramBot.used_storage_size,
	className,
	style,
	...props
}: TelegramBotStorageProps): ReactElement<TelegramBotStorageProps> {
	return (
		<div
			{...props}
			className={classNames('d-flex gap-2', className)}
			style={{ fontSize: size && `${fontSizes[size]}px`, ...style }}
		>
			<span>{`${(usedStorageSize / 1024 ** 2).toFixed(2)} MB`}</span>
			<ProgressBar
				variant='dark'
				now={usedStorageSize}
				max={telegramBot.storage_size}
				className='flex-fill align-self-center'
			/>
			<span>{`${(telegramBot.storage_size / 1024 ** 2).toFixed(2)} MB`}</span>
		</div>
	);
}

export default memo(TelegramBotStorage);