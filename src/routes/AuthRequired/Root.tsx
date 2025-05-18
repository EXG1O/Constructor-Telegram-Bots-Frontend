import React, { ReactElement, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { reverse, RouteID } from 'routes';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import Spinner from 'components/ui/Spinner';

function Root(): ReactElement {
  const navigate = useNavigate();
  const { user } = useRootRouteLoaderData();

  useEffect(() => {
    if (!user) navigate(reverse(RouteID.Home));
  }, [user]);

  return user ? <Outlet /> : <Spinner size='xl' className='m-auto' />;
}

export default Root;
