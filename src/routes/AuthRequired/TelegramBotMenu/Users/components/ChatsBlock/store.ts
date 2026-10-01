import i18n from 'i18n';
import type { TOptions } from 'i18next';
import { createStore } from 'zustand';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Mode } from './components/BlockToolbar/components/ModeTabs';
import type { Type } from './components/BlockToolbar/components/TypeTabs';

import type { Chat } from 'api';
import { ChatType, TelegramBotsService } from 'api';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

import type { ChatPagination } from '../../loader';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.TelegramBotMenuUsers}`;
}

export interface StateData extends Omit<ChatPagination, 'results'> {
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

const typeMap: Record<Type, ChatType | undefined> = {
  all: undefined,
  private: ChatType.Private,
  group: ChatType.Group,
  supergroup: ChatType.Supergroup,
  channel: ChatType.Channel,
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

        const search = params?.search === undefined ? currentSearch : params?.search;
        const mode = params?.mode ?? currentMode;
        const type = params?.type ?? currentType;

        const { data, error } = await TelegramBotsService.getChatList({
          path: { telegramBotId: telegramBot.id },
          query: {
            limit,
            offset: params?.offset ?? currentOffset,
            ...(search && { search }),
            ...(typeMap[type] && { chat_type: typeMap[type] }),
            ...(mode === 'allowed' && { is_allowed: true }),
            ...(mode === 'blocked' && { is_blocked: true }),
          },
        });

        if (error || !data) {
          createMessageToast({
            message: i18n.t<string, StrictTOptions, string, StrictTOptions>(
              'chatsBlock.messages.getChats.error',
              { ns: 'telegram-bot-menu-users' },
            ),
            level: 'error',
          });
          set({ loading: false });
          return;
        }

        const { results, ...rest } = data;
        set({ ...rest, search, mode, type, chats: results, loading: false });
      },
    })),
);
