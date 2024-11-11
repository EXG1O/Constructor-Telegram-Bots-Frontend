import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import Input from 'react-bootstrap/FormControl';

import useVariableModalStore from '../hooks/useVariableModalStore';

export type Name = string;

export const defaultName: Name = '';

function NameInput(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.variableModal.nameInput',
	});

	const name = useVariableModalStore((state) => state.name);
	const setName = useVariableModalStore((state) => state.setName);

	return (
		<Input
			value={name}
			placeholder={t('placeholder')}
			onChange={(e) => setName(e.target.value)}
		/>
	);
}

export default memo(NameInput);
