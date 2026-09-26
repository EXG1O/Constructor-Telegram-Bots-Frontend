import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useTelegramBotMenuConstructorRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuConstructor) as Awaited<
    ReturnType<typeof loader>
  >;
}

export default useTelegramBotMenuConstructorRouteLoaderData;
