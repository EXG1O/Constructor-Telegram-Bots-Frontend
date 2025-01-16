import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';

import Block, { BlockProps } from 'components/Block';

export type HeaderProps = Omit<BlockProps, 'variant' | 'gradient' | 'children'>;

function Header({ className, ...props }: HeaderProps): ReactElement<HeaderProps> {
	const { t } = useTranslation(RouteID.Home, { keyPrefix: 'header' });

	return (
		<Block
			{...props}
			variant='light'
			className={classNames(className, 'text-center')}
		>
			<h1 className='fw-bold'>Constructor Telegram Bots</h1>
			<p className='fs-5 w-100 w-xl-75 mx-xl-auto'>{t('text')}</p>
		</Block>
	);
}

export default memo(Header);
