import React, { ReactElement, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { reverse } from 'routes';
import useRootRouteLoaderData from 'routes/Root/hooks/useRootRouteLoaderData';

import Loading from 'components/Loading';

function Root(): ReactElement {
	const navigate = useNavigate();
	const { user } = useRootRouteLoaderData();

	useEffect(() => {
		!user && navigate(reverse('home'));
	}, [user]);

	return user ? <Outlet /> : <Loading size='xl' className='m-auto' />;
}

export default Root;
