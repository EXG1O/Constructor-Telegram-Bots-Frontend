import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import useUserVariablesStore from '../hooks/useUserVariablesStore';

function Footer(): ReactElement | null {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.footer',
	});

	const variableCount = useUserVariablesStore((state) => state.count);

	return variableCount ? (
		<small className='text-body-secondary text-end'>
			{t('variableCount', { count: variableCount })}
		</small>
	) : null;
}

export default Footer;
