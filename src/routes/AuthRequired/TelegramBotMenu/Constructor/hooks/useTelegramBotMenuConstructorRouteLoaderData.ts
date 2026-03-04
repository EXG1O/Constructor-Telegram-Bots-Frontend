import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useTelegramBotMenuConstructorRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuConstructor) as LoaderData;
}

export default useTelegramBotMenuConstructorRouteLoaderData;
