import i18n from 'i18n';
import type { TOptions } from 'i18next';
import { createStore } from 'zustand';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Mode } from './components/BlockToolbar/components/ModeTabs';

import { TelegramBotsService, type TelegramBotUser } from 'api';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

import type { UserPagination } from '../../loader';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.TelegramBotMenuUsers}`;
}

export interface StateData extends Omit<UserPagination, 'results'> {
  search: string | null;
  mode: Mode;
  users: TelegramBotUser[];
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

        const { data, error } = await TelegramBotsService.getUserList({
          path: { telegramBotId: telegramBot.id },
          query: {
            limit,
            offset,
            ...(search && { search }),
            ...(mode === 'allowed' && { is_allowed: true }),
            ...(mode === 'blocked' && { is_blocked: true }),
          },
        });

        if (error || !data) {
          createMessageToast({
            message: i18n.t<string, StrictTOptions, string, StrictTOptions>(
              'usersBlock.messages.getUsers.error',
              { ns: 'telegram-bot-menu-users' },
            ),
            level: 'error',
          });
          set({ loading: false });
          return;
        }

        const { count, results } = data;

        set({ count, offset, search, mode, users: results, loading: false });
      },
    })),
);
