import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function useTermsOfServiceRouteLoaderData() {
  return useRouteLoaderData(RouteID.TermsOfService) as LoaderData;
}

export default useTermsOfServiceRouteLoaderData;
