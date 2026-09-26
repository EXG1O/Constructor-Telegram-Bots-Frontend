import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useLoginLoaderData() {
  return useRouteLoaderData(RouteID.Login) as Awaited<ReturnType<typeof loader>>;
}

export default useLoginLoaderData;
