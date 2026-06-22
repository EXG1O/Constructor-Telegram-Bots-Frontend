import i18n from 'i18n';
import type { TOptions } from 'i18next';
import { createStore } from 'zustand';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Mode } from './components/BlockToolbar/components/ModeTabs';
import type { Type } from './components/BlockToolbar/components/TypeTabs';

import { ChatsAPI } from 'api/telegram-bots/chat';
import { ChatType } from 'api/telegram-bots/chat/enums';
import type { Chat } from 'api/telegram-bots/chat/types';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

export interface StateData {
  count: number;
  limit: number;
  offset: number;
  search: string | null;
  mode: Mode;
  type: Type;
  chats: Chat[];
  loading: boolean;
}

interface UpdateChatsParams extends Partial<
  Pick<StateData, 'offset' | 'search' | 'mode' | 'type'>
> {}

export interface StateActions {
  updateChats: (params?: UpdateChatsParams) => Promise<void>;
}

export type State = BaseState<StoreProps> & StateData & StateActions;

export interface StoreProps extends StateData {}

const langOptions: TOptions = { ns: RouteID.TelegramBotMenuUsers };
const typeMap: Record<Type, ChatType | undefined> = {
  all: undefined,
  private: ChatType.PRIVATE,
  group: ChatType.GROUP,
  supergroup: ChatType.SUPERGROUP,
  channel: ChatType.CHANNEL,
};

export const [ChatsBlockStoreProvider, useChatsBlockStore] = createZustandContext(
  (props: StoreProps) =>
    createStore<State>((set, get) => ({
      ...props,

      syncFromProps: (props) => set(props),

      updateChats: async (params) => {
        set({ loading: true });

        const telegramBot = useTelegramBotStore.getState().telegramBot!;
        const {
          limit,
          offset: currentOffset,
          search: currentSearch,
          mode: currentMode,
          type: currentType,
        } = get();

        const offset = params?.offset ?? currentOffset;
        const search = params?.search === undefined ? currentSearch : params?.search;
        const mode = params?.mode ?? currentMode;
        const type = params?.type ?? currentType;

        const response = await ChatsAPI.get(
          telegramBot.id,
          limit,
          offset,
          search ?? undefined,
          typeMap[type],
          mode === 'allowed'
            ? 'is_allowed'
            : mode === 'blocked'
              ? 'is_blocked'
              : undefined,
        );

        if (!response.ok) {
          createMessageToast({
            message: i18n.t('messages.getChats.error', langOptions),
            level: 'error',
          });
          set({ loading: false });
          return;
        }

        const { count, results } = response.json;

        set({ count, offset, search, mode, type, chats: results, loading: false });
      },
    })),
);
