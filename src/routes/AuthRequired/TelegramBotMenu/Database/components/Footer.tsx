import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import useDatabaseRecordsStore from '../hooks/useDatabaseRecordsStore';

function Footer(): ReactElement | null {
	const { t } = useTranslation(RouteID.TelegramBotMenuDatabase, {
		keyPrefix: 'footer',
	});

	const recordCount = useDatabaseRecordsStore((state) => state.count);

	return recordCount ? (
		<small className='text-body-secondary text-end'>
			{t('recordCount', { count: recordCount })}
		</small>
	) : null;
}

export default Footer;
