import React, { ReactElement } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Cookies from 'js-cookie';

import Loading from 'components/Loading';

import Header from './components/Header';
import Footer from './components/Footer';

import ToastProvider from 'services/providers/ToastProvider';

import { UserAPI } from 'services/api/users/main';
import { User } from 'services/api/users/types';

export interface LoaderData {
	user: User | null;
}

export async function loader(): Promise<LoaderData> {
	let user: LoaderData['user'] = null;

	if (Cookies.get('auth-token') !== undefined) {
		const response = await UserAPI.get();

		if (response.ok) {
			user = response.json;
		} else {
			Cookies.remove('auth-token');
		}
	}

	return { user };
}

function Root(): ReactElement {
	const navigation = useNavigation();

	return (
		<ToastProvider>
			<Header />
			{navigation.state === 'idle' ? (
				<Outlet />
			) : (
				<Loading size='lg' className='m-auto' />
			)}
			<Footer />
		</ToastProvider>
	);
}

export default Root;