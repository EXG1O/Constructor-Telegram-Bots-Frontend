import { useRouteLoaderData } from 'react-router-dom';

import { RouteID } from 'routes';

import { LoaderData } from '../loader';

function useInstructionRouteLoaderData() {
  return useRouteLoaderData(RouteID.Instruction) as LoaderData;
}

export default useInstructionRouteLoaderData;
