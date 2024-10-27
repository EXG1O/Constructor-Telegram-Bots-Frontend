import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useUpdatesRouteLoaderData() {
	return useRouteLoaderData(RouteID.Updates) as LoaderData;
}

export default useUpdatesRouteLoaderData;
