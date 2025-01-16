import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import useUsersStore from '../hooks/useUsersStore';

function Footer(): ReactElement | null {
	const { t } = useTranslation(RouteID.TelegramBotMenuUsers, {
		keyPrefix: 'footer',
	});

	const userCount = useUsersStore((state) => state.count);

	return userCount ? (
		<small className='text-body-secondary text-end'>
			{t('userCount', { count: userCount })}
		</small>
	) : null;
}

export default Footer;
