import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useTelegramBotsRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBots) as Awaited<ReturnType<typeof loader>>;
}

export default useTelegramBotsRouteLoaderData;
