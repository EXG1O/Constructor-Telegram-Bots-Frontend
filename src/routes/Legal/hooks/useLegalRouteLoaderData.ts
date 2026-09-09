import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useLegalRouteLoaderData() {
  return useRouteLoaderData(RouteID.Legal) as LoaderData;
}

export default useLegalRouteLoaderData;
