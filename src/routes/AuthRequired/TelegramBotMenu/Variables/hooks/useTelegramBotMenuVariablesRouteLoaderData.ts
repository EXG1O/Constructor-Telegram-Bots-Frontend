import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useTelegramBotMenuVariablesRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuVariables) as LoaderData;
}

export default useTelegramBotMenuVariablesRouteLoaderData;
