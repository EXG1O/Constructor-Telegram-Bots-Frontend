import { createContext, Dispatch, SetStateAction } from 'react';

import { TelegramBot } from 'api/telegram_bots/telegram_bot/types';

export type TelegramBotsContextProps = [
  TelegramBot[],
  Dispatch<SetStateAction<TelegramBot[]>>,
];

const TelegramBotsContext = createContext<TelegramBotsContextProps | undefined>(
  undefined,
);

export default TelegramBotsContext;
