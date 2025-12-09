import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useTermsOfServiceRouteLoaderData() {
  return useRouteLoaderData(RouteID.TermsOfService) as LoaderData;
}

export default useTermsOfServiceRouteLoaderData;
