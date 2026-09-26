import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useTelegramBotMenuVariablesRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuVariables) as Awaited<
    ReturnType<typeof loader>
  >;
}

export default useTelegramBotMenuVariablesRouteLoaderData;
