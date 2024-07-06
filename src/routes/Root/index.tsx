import React, { ReactElement } from 'react';
import { Outlet, useNavigation } from 'react-router-dom';
import Cookies from 'js-cookie';

import AskConfirmModal from 'components/AskConfirmModal';
import Loading from 'components/Loading';
import ToastContainer from 'components/ToastContainer';

import Footer from './components/Footer';
import Header from './components/Header';

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
		<>
			<ToastContainer />
			<AskConfirmModal />
			<Header />
			{navigation.state === 'idle' ? (
				<Outlet />
			) : (
				<Loading size='lg' className='m-auto' />
			)}
			<Footer />
		</>
	);
}

export default Root;
