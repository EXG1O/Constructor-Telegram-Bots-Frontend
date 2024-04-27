import React, { ReactElement, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import LoginButton from 'components/LoginButton';

import Links from './components/Links';
import LanguagesDropdown from './components/LanguagesDropdown';
import UserMenuDropdown from './components/UserMenuDropdown';

import { LoaderData as RootLoaderData } from 'routes/Root';

function Header(): ReactElement {
	const { user } = useRouteLoaderData('root') as RootLoaderData;

	return (
		<Navbar expand='xxl' variant='dark' className='bg-dark'>
			<Container>
				<Navbar.Brand>Constructor Telegram Bots</Navbar.Brand>
				<Navbar.Toggle aria-controls='header' />
				<Navbar.Collapse className='justify-content-between' id='header'>
					<Links />
					<hr className='d-xxl-none text-white-50 mt-0 mb-2'></hr>
					<div className='d-flex flex-wrap gap-2'>
						<LanguagesDropdown />
						{user ? (
							<UserMenuDropdown user={user} />
						) : (
							<LoginButton variant='success' />
						)}
					</div>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default memo(Header);