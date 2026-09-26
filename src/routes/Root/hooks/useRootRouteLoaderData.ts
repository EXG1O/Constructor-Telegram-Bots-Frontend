import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useRootRouteLoaderData() {
  return useRouteLoaderData(RouteID.Root) as Awaited<ReturnType<typeof loader>>;
}

export default useRootRouteLoaderData;
