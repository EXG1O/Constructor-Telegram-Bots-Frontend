import { createContext, Dispatch, SetStateAction } from 'react';

import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

export type TelegramBotContextType = [
  TelegramBot,
  Dispatch<SetStateAction<TelegramBot>>,
];

const TelegramBotContext = createContext<TelegramBotContextType | undefined>(undefined);

export default TelegramBotContext;
