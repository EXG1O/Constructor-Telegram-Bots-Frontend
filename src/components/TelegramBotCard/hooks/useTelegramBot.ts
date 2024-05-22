import { useContext } from 'react';

import TelegramBotContext, {
	TelegramBotContextProps,
} from '../contexts/TelegramBotContext';

function useTelegramBot(): TelegramBotContextProps {
	const context = useContext<TelegramBotContextProps | undefined>(TelegramBotContext);

	if (context === undefined) {
		throw new Error(
			'useTelegramBot must be used with a TelegramBotContext.Provider!',
		);
	}

	return context;
}

export default useTelegramBot;
