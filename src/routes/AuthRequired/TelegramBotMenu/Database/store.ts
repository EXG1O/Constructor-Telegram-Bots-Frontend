import i18n from 'i18n';
import type { TOptions } from 'i18next';
import { create } from 'zustand';

import type { RouteID } from 'routes';
import { useTelegramBotStore } from 'routes/AuthRequired/TelegramBotMenu/Root/store';

import { createMessageToast } from 'components/ui/ToastContainer';

import type { DatabaseRecord } from 'api';
import { TelegramBotsService } from 'api';

import type { RecordPagination } from './loader';

interface StrictTOptions extends TOptions {
  ns: `${RouteID.TelegramBotMenuDatabase}`;
}

export interface StateParams extends Omit<RecordPagination, 'results'> {
  loading: boolean;
  records: DatabaseRecord[];
}

export interface StateActions {
  updateRecords: (
    limit?: StateParams['limit'],
    offset?: StateParams['offset'],
    search?: StateParams['search'],
  ) => Promise<void>;

  setLoading: (loading: boolean) => void;
}

export type State = StateParams & StateActions;

export type InitialProps = Pick<
  StateParams,
  'count' | 'limit' | 'offset' | 'search' | 'records'
>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

export function createStore(initialProps: InitialProps) {
  const initialState: InitialState = { loading: false };

  return create<State>((set, get) => ({
    ...initialState,
    ...initialProps,

    updateRecords: async (newLimit, newOffset, newSearch) => {
      set({ loading: true });

      const telegramBot = useTelegramBotStore.getState().telegramBot!;
      const {
        limit: currentLimit,
        offset: currentOffset,
        search: currentSearch,
      } = get();

      const search = newSearch === undefined ? currentSearch : newSearch;

      const { data, error } = await TelegramBotsService.getDatabaseRecordList({
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
            'messages.getRecords.error',
            { ns: 'telegram-bot-menu-database' },
          ),
          level: 'error',
        });
        set({ loading: false });
        return;
      }

      const { results, ...rest } = data;
      set({ ...rest, loading: false, search, records: results });
    },

    setLoading: (loading) => set({ loading }),
  }));
}
