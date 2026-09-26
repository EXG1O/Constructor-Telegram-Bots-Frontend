import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useProfileRouteLoaderData() {
  return useRouteLoaderData(RouteID.Profile) as Awaited<ReturnType<typeof loader>>;
}

export default useProfileRouteLoaderData;
