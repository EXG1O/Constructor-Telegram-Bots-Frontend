import { Dispatch, SetStateAction, createContext } from 'react';

import { TelegramBot } from 'services/api/telegram_bots/types';

export type TelegramBotContextType = [
	TelegramBot,
	Dispatch<SetStateAction<TelegramBot>>,
];

const TelegramBotContext = createContext<TelegramBotContextType | undefined>(undefined);

export default TelegramBotContext;
