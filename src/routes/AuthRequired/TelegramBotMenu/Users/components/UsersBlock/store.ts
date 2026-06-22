import i18n from 'i18n';
import type { TOptions } from 'i18next';
import { createStore } from 'zustand';

import { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Mode } from './components/BlockToolbar/components/ModeTabs';

import { UsersAPI } from 'api/telegram-bots/user';
import type { User } from 'api/telegram-bots/user/types';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

export interface StateData {
  count: number;
  limit: number;
  offset: number;
  search: string | null;
  mode: Mode;
  users: User[];
  loading: boolean;
}

interface UpdateUsersParams extends Partial<
  Pick<StateData, 'offset' | 'search' | 'mode'>
> {}

export interface StateActions {
  updateUsers: (params?: UpdateUsersParams) => Promise<void>;
}

export type State = BaseState<StoreProps> & StateData & StateActions;

export interface StoreProps extends StateData {}

const langOptions: TOptions = { ns: RouteID.TelegramBotMenuUsers };

export const [UsersBlockStoreProvider, useUsersBlockStore] = createZustandContext(
  (props: StoreProps) =>
    createStore<State>((set, get) => ({
      ...props,

      syncFromProps: (props) => set(props),

      updateUsers: async (params) => {
        set({ loading: true });

        const telegramBot = useTelegramBotStore.getState().telegramBot!;
        const {
          limit,
          offset: currentOffset,
          search: currentSearch,
          mode: currentMode,
        } = get();

        const offset = params?.offset ?? currentOffset;
        const search = params?.search === undefined ? currentSearch : params?.search;
        const mode = params?.mode ?? currentMode;

        const response = await UsersAPI.get(
          telegramBot.id,
          limit,
          offset,
          search ?? undefined,
          mode === 'allowed'
            ? 'is_allowed'
            : mode === 'blocked'
              ? 'is_blocked'
              : undefined,
        );

        if (!response.ok) {
          createMessageToast({
            message: i18n.t('messages.getUsers.error', langOptions),
            level: 'error',
          });
          set({ loading: false });
          return;
        }

        const { count, results } = response.json;

        set({ count, offset, search, mode, users: results, loading: false });
      },
    })),
);
