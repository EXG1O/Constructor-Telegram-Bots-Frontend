import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useRootRouteLoaderData() {
  return useRouteLoaderData(RouteID.Root) as LoaderData;
}

export default useRootRouteLoaderData;
