import React, { ReactElement, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { RouteID } from 'routes';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import Spinner from 'components/ui/Spinner';

import reverse from 'utils/reverse';

function Root(): ReactElement {
  const { user } = useRootRouteLoaderData();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) return;
    navigate(reverse(RouteID.Home));
  }, [user]);

  return user ? (
    <Outlet />
  ) : (
    <main className='flex flex-auto items-center justify-center'>
      <Spinner />
    </main>
  );
}

export default Root;
