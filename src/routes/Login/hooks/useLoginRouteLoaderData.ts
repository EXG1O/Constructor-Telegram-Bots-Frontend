import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useLoginLoaderData() {
  return useRouteLoaderData(RouteID.Login) as LoaderData;
}

export default useLoginLoaderData;
