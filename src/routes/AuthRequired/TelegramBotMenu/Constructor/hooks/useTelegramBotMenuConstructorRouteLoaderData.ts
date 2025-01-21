import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useTelegramBotMenuConstructorRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuConstructor) as LoaderData;
}

export default useTelegramBotMenuConstructorRouteLoaderData;
