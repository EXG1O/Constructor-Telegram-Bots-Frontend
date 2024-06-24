import React, { ReactElement, HTMLAttributes, memo } from 'react';

import classNames from 'classnames';

export type HeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
	return (
		<div
			{...props}
			className={classNames('text-center text-bg-light rounded-4 p-3', className)}
		>
			<h1 className='fw-bold'>Constructor Telegram Bots</h1>
			<p className='fs-5 w-100 w-xl-75 mx-xl-auto'>
				{gettext(`
					Сайт, с помощью которого вы можете легко,
					бесплатно и без каких-либо знаний в программировании,
					создать своего многофункционального Telegram бота.
				`)}
			</p>
		</div>
	);
}

export default memo(Header);
