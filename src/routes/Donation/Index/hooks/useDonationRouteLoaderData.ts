import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useDonationRouteLoaderData() {
  return useRouteLoaderData(RouteID.Donation) as LoaderData;
}

export default useDonationRouteLoaderData;
