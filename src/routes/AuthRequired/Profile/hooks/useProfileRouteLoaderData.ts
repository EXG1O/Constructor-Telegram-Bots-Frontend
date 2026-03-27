import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useProfileRouteLoaderData() {
  return useRouteLoaderData(RouteID.Profile) as LoaderData;
}

export default useProfileRouteLoaderData;
