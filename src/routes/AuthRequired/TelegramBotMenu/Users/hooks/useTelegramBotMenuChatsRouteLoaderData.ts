import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useTelegramBotMenuChatsRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuUsers) as LoaderData;
}

export default useTelegramBotMenuChatsRouteLoaderData;
