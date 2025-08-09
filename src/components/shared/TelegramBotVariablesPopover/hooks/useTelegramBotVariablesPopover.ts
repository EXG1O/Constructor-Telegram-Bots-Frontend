import { useContext } from 'react';

import TelegramBotVariablesPopoverContext, {
  TelegramBotVariablesPopoverContextProps,
} from '../contexts/TelegramBotVariablesPopoverContext';

function useTelegramBotVariablesPopover(): TelegramBotVariablesPopoverContextProps {
  const context = useContext<TelegramBotVariablesPopoverContextProps | undefined>(
    TelegramBotVariablesPopoverContext,
  );

  if (context === undefined) {
    throw new Error(
      'useTelegramBotVariablesPopover must be used with a TelegramBotVariablesPopoverContext.',
    );
  }

  return context;
}

export default useTelegramBotVariablesPopover;
