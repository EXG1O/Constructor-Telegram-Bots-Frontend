import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useTelegramBotsRouteLoaderData() {
	return useRouteLoaderData(RouteID.TelegramBots) as LoaderData;
}

export default useTelegramBotsRouteLoaderData;
