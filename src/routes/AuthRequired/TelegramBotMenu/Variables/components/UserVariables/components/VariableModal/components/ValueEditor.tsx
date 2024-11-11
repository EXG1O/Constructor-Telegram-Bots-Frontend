import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import TelegramQuillEditor, {
	TelegramQuillEditorProps,
} from 'components/TelegramQuillEditor';

import useVariableModalStore from '../hooks/useVariableModalStore';

export type Value = string;

export const defaultValue: Value = '';

type HandleChangeFunc = NonNullable<TelegramQuillEditorProps['onChange']>;

function ValueEditor(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.variableModal.valueInput',
	});

	const value = useVariableModalStore((state) => state.value);
	const setValue = useVariableModalStore((state) => state.setValue);

	const handleChange = useCallback<HandleChangeFunc>(
		(value) => setValue(value),
		[setValue],
	);

	return (
		<TelegramQuillEditor
			height={220}
			value={value}
			placeholder={t('placeholder')}
			onChange={handleChange}
		/>
	);
}

export default memo(ValueEditor);
