import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';

import Block, { BlockProps } from 'components/Block';

export type HeaderProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
	return (
		<Block
			{...props}
			variant='light'
			className={classNames(className, 'text-center')}
		>
			<h1 className='fw-bold'>Constructor Telegram Bots</h1>
			<p className='fs-5 w-100 w-xl-75 mx-xl-auto'>
				{gettext(`
					Сайт, с помощью которого вы можете легко,
					бесплатно и без каких-либо знаний в программировании,
					создать своего многофункционального Telegram бота.
				`)}
			</p>
		</Block>
	);
}

export default memo(Header);
