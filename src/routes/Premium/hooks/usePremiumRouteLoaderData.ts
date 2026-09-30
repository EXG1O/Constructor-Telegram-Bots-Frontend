import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function usePremiumRouteLoaderData() {
  return useRouteLoaderData(RouteID.Premium) as Awaited<ReturnType<typeof loader>>;
}

export default usePremiumRouteLoaderData;
