import React, { ReactElement, memo } from 'react';
import classNames from 'classnames';

import Input, { FormControlProps as InputProps } from 'react-bootstrap/FormControl';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type DescriptionInputProps = Omit<
	InputProps,
	'value' | 'placeholder' | 'children' | 'onChange'
>;

export type Description = string;

export const defaultDescription: Description = '';

function DescriptionInput({
	className,
	...props
}: DescriptionInputProps): ReactElement<DescriptionInputProps> {
	const description = useCommandOffcanvasStore((state) => state.trigger.description);
	const updateTrigger = useCommandOffcanvasStore((state) => state.updateTrigger);

	return (
		<Input
			{...props}
			value={description}
			className={classNames('border-top-0 rounded-top-0', className)}
			placeholder={gettext('Введите описание')}
			onChange={(e) =>
				updateTrigger((trigger) => {
					trigger.description = e.target.value;
				})
			}
		/>
	);
}

export default memo(DescriptionInput);
