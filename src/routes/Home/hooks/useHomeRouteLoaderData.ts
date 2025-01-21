import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useHomeRouteLoaderData() {
  return useRouteLoaderData(RouteID.Home) as LoaderData;
}

export default useHomeRouteLoaderData;
