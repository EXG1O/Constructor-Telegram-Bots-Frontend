import { createContext, Dispatch, SetStateAction } from 'react';

import { TelegramBot } from 'services/api/telegram_bots/types';

export type TelegramBotsContextProps = [
	TelegramBot[],
	Dispatch<SetStateAction<TelegramBot[]>>,
];

const TelegramBotsContext = createContext<TelegramBotsContextProps | undefined>(
	undefined,
);

export default TelegramBotsContext;
