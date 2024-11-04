import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useTelegramBotMenuRootRouteLoaderData() {
	return useRouteLoaderData(RouteID.TelegramBotMenuRoot) as LoaderData;
}

export default useTelegramBotMenuRootRouteLoaderData;
