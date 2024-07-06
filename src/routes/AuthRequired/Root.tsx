import React, { ReactElement, useEffect } from 'react';
import { Outlet, useNavigate, useRouteLoaderData } from 'react-router-dom';

import { reverse } from 'routes';
import { LoaderData as RootLoaderData } from 'routes/Root';

import Loading from 'components/Loading';

function Root(): ReactElement {
	const navigate = useNavigate();
	const { user } = useRouteLoaderData('root') as RootLoaderData;

	useEffect(() => {
		!user && navigate(reverse('home'));
	}, [user]);

	return user ? <Outlet /> : <Loading size='xl' className='m-auto' />;
}

export default Root;
