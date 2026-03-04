import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useTelegramBotMenuDatabaseRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuDatabase) as LoaderData;
}

export default useTelegramBotMenuDatabaseRouteLoaderData;
