import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Input from 'react-bootstrap/FormControl';

import useVariableModalStore from '../hooks/useVariableModalStore';

export type Description = string;

export const defaultDescription: Description = '';

function DescriptionInput(): ReactElement {
	const { t } = useTranslation('telegram-bot-menu-variables', {
		keyPrefix: 'user.variableModal.descriptionInput',
	});

	const description = useVariableModalStore((state) => state.description);
	const setDescription = useVariableModalStore((state) => state.setDescription);

	return (
		<Input
			value={description}
			placeholder={t('placeholder')}
			onChange={(e) => setDescription(e.target.value)}
		/>
	);
}

export default memo(DescriptionInput);
