import React, { HTMLAttributes, ReactElement, memo } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import classNames from 'classnames';

import LoginButton from 'components/LoginButton';

import LanguagesDropdown from './LanguagesDropdown';
import UserMenuDropdown from './UserMenuDropdown';

import { LoaderData as RootLoaderData } from 'routes/Root';

export type ButtonsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Buttons({ className, ...props }: ButtonsProps): ReactElement<ButtonsProps> {
	const { user } = useRouteLoaderData('root') as RootLoaderData;

	return (
		<div
			{...props}
			className={classNames(
				'd-flex flex-nowrap justify-content-lg-end gap-2',
				className,
			)}
		>
			<LanguagesDropdown />
			{user ? <UserMenuDropdown user={user} /> : <LoginButton variant='dark' />}
		</div>
	);
}

export default memo(Buttons);
