import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useTelegramBotMenuRouteLoaderData() {
	return useRouteLoaderData(RouteID.TelegramBotMenu) as LoaderData;
}

export default useTelegramBotMenuRouteLoaderData;
