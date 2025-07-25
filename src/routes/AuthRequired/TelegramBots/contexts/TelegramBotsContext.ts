import { createContext, Dispatch, SetStateAction } from 'react';

import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

export type TelegramBotsContextProps = [
  TelegramBot[],
  Dispatch<SetStateAction<TelegramBot[]>>,
];

const TelegramBotsContext = createContext<TelegramBotsContextProps | undefined>(
  undefined,
);

export default TelegramBotsContext;
