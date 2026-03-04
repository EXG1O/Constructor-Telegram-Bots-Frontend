import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useTelegramBotsRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBots) as LoaderData;
}

export default useTelegramBotsRouteLoaderData;
