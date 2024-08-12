import React, { memo, ReactElement, useCallback } from 'react';

import TelegramQuillEditor, {
	TelegramQuillEditorProps,
} from 'components/TelegramQuillEditor';

import useVariableModalStore from '../hooks/useVariableModalStore';

export type Value = string;

export const defaultValue: Value = '';

type HandleChangeFunc = NonNullable<TelegramQuillEditorProps['onChange']>;

function ValueEditor(): ReactElement {
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
			placeholder={gettext('Введите значение')}
			onChange={handleChange}
		/>
	);
}

export default memo(ValueEditor);
