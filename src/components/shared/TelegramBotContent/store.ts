import { createStore } from 'zustand';

import type { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

export interface StateData {
  telegramBot: TelegramBot;
  isEditingAPIToken: boolean;
  onChange?: (telegramBot: StateData['telegramBot']) => void;
}

export interface StateActions {
  setTelegramBot: (telegramBot: StateData['telegramBot']) => void;
  toggleAPITokenState: () => void;
}

export type State = BaseState<StoreProps> & StateData & StateActions;

export interface StoreProps extends Omit<StateData, 'isEditingAPIToken'> {}

export const [TelegramBotContentStoreProvider, useTelegramBotContentStore] =
  createZustandContext((props: StoreProps) =>
    createStore<State>((set, get) => ({
      ...props,

      isEditingAPIToken: false,

      syncFromProps: (props) => set(props),

      setTelegramBot: (telegramBot) => {
        set({ telegramBot });
        get().onChange?.(telegramBot);
      },
      toggleAPITokenState: () => set({ isEditingAPIToken: !get().isEditingAPIToken }),
    })),
  );
