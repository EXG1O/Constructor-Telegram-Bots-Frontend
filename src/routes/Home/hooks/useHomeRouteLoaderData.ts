import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useHomeRouteLoaderData() {
  return useRouteLoaderData(RouteID.Home) as Awaited<ReturnType<typeof loader>>;
}

export default useHomeRouteLoaderData;
