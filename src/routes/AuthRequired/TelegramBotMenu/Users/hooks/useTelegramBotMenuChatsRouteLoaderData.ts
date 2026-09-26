import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useTelegramBotMenuChatsRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuUsers) as Awaited<
    ReturnType<typeof loader>
  >;
}

export default useTelegramBotMenuChatsRouteLoaderData;
