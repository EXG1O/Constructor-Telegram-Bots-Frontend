import i18n from 'i18n';
import { TOptions } from 'i18next';
import { create } from 'zustand';

import { RouteID } from 'routes';

import { createMessageToast } from 'components/ui/ToastContainer';

import { DatabaseRecordsAPI } from 'api/telegram-bots/database-record';
import { DatabaseRecord } from 'api/telegram-bots/database-record/types';
import { TelegramBot } from 'api/telegram-bots/telegram-bot/types';

export interface StateParams {
  telegramBot: TelegramBot;

  loading: boolean;

  count: number;
  limit: number;
  offset: number;
  search: string | null;

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
  'telegramBot' | 'count' | 'limit' | 'offset' | 'search' | 'records'
>;
export type InitialState = Omit<StateParams, keyof InitialProps>;

const langOptions: TOptions = { ns: RouteID.TelegramBotMenuDatabase };

export function createStore(initialProps: InitialProps) {
  const initialState: InitialState = { loading: false };

  return create<State>((set, get) => ({
    ...initialState,
    ...initialProps,

    updateRecords: async (newLimit, newOffset, newSearch) => {
      set({ loading: true });

      const {
        telegramBot,
        limit: currentLimit,
        offset: currentOffset,
        search: currentSearch,
      } = get();

      const limit = newLimit ?? currentLimit;
      const offset = newOffset ?? currentOffset;
      const search = newSearch === undefined ? currentSearch : newSearch;

      const response = await DatabaseRecordsAPI.get(
        telegramBot.id,
        limit,
        offset,
        search ?? undefined,
      );

      if (!response.ok) {
        createMessageToast({
          message: i18n.t('messages.getRecords.error', langOptions),
          level: 'error',
        });
        set({ loading: false });
        return;
      }

      const { count, results } = response.json;

      set({ loading: false, count, limit, offset, search, records: results });
    },

    setLoading: (loading) => set({ loading }),
  }));
}
