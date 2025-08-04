import { create } from 'zustand';

import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

export interface StoreParams {
  telegramBot: TelegramBot;
  isEditingAPIToken: boolean;
  onChange?: (telegramBot: TelegramBot) => void;
}

export interface StoreActions {
  setTelegramBot: (telegramBot: StoreParams['telegramBot']) => void;
  toggleAPITokenState: () => void;
}

export type StoreState = StoreParams & StoreActions;

export type InitialStoreProps = Pick<StoreParams, 'telegramBot' | 'onChange'>;
export type InitialStoreState = Omit<StoreParams, keyof InitialStoreProps>;

export function createStore(initialProps: InitialStoreProps) {
  const initialState: InitialStoreState = { isEditingAPIToken: false };

  return create<StoreState>((set, get) => ({
    ...initialProps,
    ...initialState,

    setTelegramBot: (telegramBot) => {
      set({ telegramBot });
      get().onChange?.(telegramBot);
    },
    toggleAPITokenState: () => set({ isEditingAPIToken: !get().isEditingAPIToken }),
  }));
}
