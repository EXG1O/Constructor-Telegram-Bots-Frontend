import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import type loader from '../loader';

function useInstructionRouteLoaderData() {
  return useRouteLoaderData(RouteID.Instruction) as Awaited<ReturnType<typeof loader>>;
}

export default useInstructionRouteLoaderData;
