import { useContext } from 'react';

import TelegramBotsContext, { TelegramBotsContextProps } from '../contexts/TelegramBotsContext';

function useTelegramBots(): TelegramBotsContextProps {
	const context = useContext<TelegramBotsContextProps | undefined>(TelegramBotsContext);

	if (context === undefined) {
		throw new Error('useTelegramBots must be used with a TelegramBotsContext!');
	}

	return context;
}

export default useTelegramBots;