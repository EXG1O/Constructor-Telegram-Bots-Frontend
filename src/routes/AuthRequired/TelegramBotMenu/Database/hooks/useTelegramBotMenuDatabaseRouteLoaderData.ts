import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useTelegramBotMenuDatabaseRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuDatabase) as Awaited<
    ReturnType<typeof loader>
  >;
}

export default useTelegramBotMenuDatabaseRouteLoaderData;
