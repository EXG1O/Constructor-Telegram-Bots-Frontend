import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type { LoaderData } from '../loader';

function usePrivacyPolicyRouteLoaderData() {
  return useRouteLoaderData(RouteID.PrivacyPolicy) as LoaderData;
}

export default usePrivacyPolicyRouteLoaderData;
