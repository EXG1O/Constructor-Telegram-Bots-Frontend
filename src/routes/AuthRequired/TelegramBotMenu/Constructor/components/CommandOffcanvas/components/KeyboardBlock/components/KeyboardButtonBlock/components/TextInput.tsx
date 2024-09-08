import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export type TextInputProps = Omit<
	InputProps,
	'size' | 'value' | 'placeholder' | 'children' | 'onChange'
>;

export type Text = string;

export const defaultText: Text = '';

function TextInput(props: TextInputProps): ReactElement<TextInputProps> {
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardBlock.textInput',
	});

	const text = useCommandOffcanvasStore((state) => state.keyboardButton.text);
	const updateKeyboardButton = useCommandOffcanvasStore(
		(state) => state.updateKeyboardButton,
	);

	return (
		<Input
			{...props}
			size='sm'
			value={text}
			placeholder={t('placeholder')}
			onChange={(e) =>
				updateKeyboardButton((keyboardButton) => {
					keyboardButton.text = e.target.value;
				})
			}
		/>
	);
}

export default memo(TextInput);
