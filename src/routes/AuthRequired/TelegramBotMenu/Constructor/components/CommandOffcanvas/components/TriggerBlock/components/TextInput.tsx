import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type TextInputProps = Omit<
	InputProps,
	'value' | 'placeholder' | 'children' | 'onChange'
>;

export type Text = string;

export const defaultText: Text = '';

function TextInput(props: TextInputProps): ReactElement<TextInputProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.triggerBlock.textInput',
	});

	const text = useCommandOffcanvasStore((state) => state.trigger.text);
	const updateTrigger = useCommandOffcanvasStore((state) => state.updateTrigger);

	return (
		<Input
			{...props}
			value={text}
			placeholder={t('placeholder')}
			onChange={(e) =>
				updateTrigger((trigger) => {
					trigger.text = e.target.value;
				})
			}
		/>
	);
}

export default memo(TextInput);
