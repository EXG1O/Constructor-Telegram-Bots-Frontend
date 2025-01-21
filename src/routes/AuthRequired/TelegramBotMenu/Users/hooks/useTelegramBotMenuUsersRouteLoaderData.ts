import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useTelegramBotMenuUsersRouteLoaderData() {
  return useRouteLoaderData(RouteID.TelegramBotMenuUsers) as LoaderData;
}

export default useTelegramBotMenuUsersRouteLoaderData;
