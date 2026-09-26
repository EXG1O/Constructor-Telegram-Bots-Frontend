import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useLegalRouteLoaderData() {
  return useRouteLoaderData(RouteID.Legal) as Awaited<ReturnType<typeof loader>>;
}

export default useLegalRouteLoaderData;
