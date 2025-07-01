import { useContext } from 'react';

import TelegramBotContext, {
  TelegramBotContextType,
} from '../contexts/TelegramBotContext';

function useTelegramBot(): TelegramBotContextType {
  const context = useContext(TelegramBotContext);

  if (context === undefined) {
    throw new Error('useTelegramBot must be used with a TelegramBotContext.');
  }

  return context;
}

export default useTelegramBot;
