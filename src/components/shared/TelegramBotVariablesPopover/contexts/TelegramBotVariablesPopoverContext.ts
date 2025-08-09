import { createContext } from 'react';

export interface TelegramBotVariablesPopoverContextProps {
  onSelect: (variable: string) => void;
}

const TelegramBotVariablesPopoverContext = createContext<
  TelegramBotVariablesPopoverContextProps | undefined
>(undefined);

export default TelegramBotVariablesPopoverContext;
