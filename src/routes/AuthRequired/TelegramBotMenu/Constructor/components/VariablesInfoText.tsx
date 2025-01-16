import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

function VariablesInfoText(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'variablesInfoText',
	});

	return <small className='text-secondary'>{t('text')}</small>;
}

export default memo(VariablesInfoText);
