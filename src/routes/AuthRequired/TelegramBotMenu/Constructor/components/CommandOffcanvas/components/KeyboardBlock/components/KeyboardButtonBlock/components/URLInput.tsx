import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export type URLInputProps = Omit<
	InputProps,
	'size' | 'value' | 'placeholder' | 'children' | 'onChange'
>;

export type URL = string;

export const defaultURL: URL = '';

function URLInput({ className, ...props }: URLInputProps): ReactElement<URLInputProps> {
	const url = useCommandOffcanvasStore((state) => state.keyboardButton.url);
	const updateKeyboardButton = useCommandOffcanvasStore(
		(state) => state.updateKeyboardButton,
	);

	return (
		<Input
			{...props}
			size='sm'
			value={url}
			className={classNames('border-top-0 rounded-top-0', className)}
			placeholder={gettext('Введите URL-адрес')}
			onChange={(e) =>
				updateKeyboardButton((keyboardButton) => {
					keyboardButton.url = e.target.value;
				})
			}
		/>
	);
}

export default memo(URLInput);
