import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function usePrivacyPolicyRouteLoaderData() {
	return useRouteLoaderData(RouteID.PrivacyPolicy) as LoaderData;
}

export default usePrivacyPolicyRouteLoaderData;
