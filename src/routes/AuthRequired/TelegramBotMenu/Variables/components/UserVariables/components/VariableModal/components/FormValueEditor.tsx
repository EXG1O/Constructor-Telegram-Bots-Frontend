import React, { memo, ReactElement, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useField, useFormikContext } from 'formik';

import { RouteID } from 'routes';

import TelegramQuillEditor, {
	TelegramQuillEditorProps,
} from 'components/TelegramQuillEditor';

export type Value = string;

type HandleChangeFunc = NonNullable<TelegramQuillEditorProps['onChange']>;

const fieldName: string = 'value';

export const defaultValue: Value = '';

function ValueEditor(): ReactElement {
	const { t } = useTranslation(RouteID.TelegramBotMenuVariables, {
		keyPrefix: 'user.variableModal.valueInput',
	});

	const { setFieldValue } = useFormikContext();
	const [field] = useField({ name: fieldName });

	const handleChange = useCallback<HandleChangeFunc>(
		(value) => setFieldValue(fieldName, value),
		[],
	);

	return (
		<TelegramQuillEditor
			height={220}
			value={field.value}
			placeholder={t('placeholder')}
			onChange={handleChange}
		/>
	);
}

export default memo(ValueEditor);
