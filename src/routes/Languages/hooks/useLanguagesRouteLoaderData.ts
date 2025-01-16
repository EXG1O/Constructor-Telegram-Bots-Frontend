import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useLanguagesRouteLoaderData() {
	return useRouteLoaderData(RouteID.Languages) as LoaderData;
}

export default useLanguagesRouteLoaderData;
