import i18n from 'i18n';
import type { TOptions } from 'i18next';
import { create } from 'zustand';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { Variable } from 'api';
import { TelegramBotsService } from 'api';

import type { VariablePagination } from '../../loader';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.TelegramBotMenuVariables}`;
}

export interface StateParams extends Omit<VariablePagination, 'results'> {
  loading: boolean;
  search: string | null;
  variables: Variable[];
}

export interface StateActions {
  updateVariables: (
    limit?: StateParams['limit'],
    offset?: StateParams['offset'],
    search?: StateParams['search'],
  ) => Promise<void>;

  setLoading: (loading: StateParams['loading']) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<
  StateParams,
  'count' | 'limit' | 'offset' | 'variables'
>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

export function createStore(initialProps: InitialProps) {
  const initialState: InitialState = {
    loading: false,
    search: null,
  };

  return create<State>((set, get) => ({
    ...initialState,
    ...initialProps,

    updateVariables: async (newLimit, newOffset, newSearch) => {
      set({ loading: true });

      const telegramBot = useTelegramBotStore.getState().telegramBot!;
      const {
        limit: currentLimit,
        offset: currentOffset,
        search: currentSearch,
      } = get();

      const search = newSearch === undefined ? currentSearch : newSearch;

      const { data, error } = await TelegramBotsService.getVariableList({
        path: { telegramBotId: telegramBot.id },
        query: {
          limit: newLimit ?? currentLimit,
          offset: newOffset ?? currentOffset,
          ...(search && { search }),
        },
      });

      if (error || !data) {
        createMessageToast({
          message: i18n.t<string, StrictTOptions, string, StrictTOptions>(
            'user.messages.getVariables.error',
            { ns: 'telegram-bot-menu-variables' },
          ),
          level: 'error',
        });
        set({ loading: false });
        return;
      }

      const { results, ...rest } = data;
      set({ ...rest, loading: false, search, variables: results });
    },

    setLoading: (loading) => set({ loading }),
  }));
}
