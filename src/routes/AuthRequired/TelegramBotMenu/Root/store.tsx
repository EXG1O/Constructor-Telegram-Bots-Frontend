import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import type { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

export interface StateData {
  telegramBot: TelegramBot | null;
}

export interface StateActions {
  setTelegramBot: (
    nextTelegramBot:
      | ((telegramBot: StateData['telegramBot']) => void)
      | StateData['telegramBot'],
  ) => void;
}

export type State = StateData & StateActions;

export const useTelegramBotStore = create<State>()(
  immer((set) => ({
    telegramBot: null,
    setTelegramBot: (nextTelegramBot) =>
      set((state) => {
        if (typeof nextTelegramBot === 'function') {
          nextTelegramBot(state.telegramBot);
        } else {
          state.telegramBot = nextTelegramBot;
        }
      }),
  })),
);
