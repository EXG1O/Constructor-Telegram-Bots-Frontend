import { useRouteLoaderData } from 'react-router-dom';

import { LoaderData } from '../loader';

function useLanguagesRouteLoaderData() {
	return useRouteLoaderData('languages') as LoaderData;
}

export default useLanguagesRouteLoaderData;
