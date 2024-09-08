import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
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
	const { t } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'commandOffcanvas.triggerBlock.descriptionInput',
	});

	const description = useCommandOffcanvasStore((state) => state.trigger.description);
	const updateTrigger = useCommandOffcanvasStore((state) => state.updateTrigger);

	return (
		<Input
			{...props}
			value={description}
			className={classNames('border-top-0 rounded-top-0', className)}
			placeholder={t('placeholder')}
			onChange={(e) =>
				updateTrigger((trigger) => {
					trigger.description = e.target.value;
				})
			}
		/>
	);
}

export default memo(DescriptionInput);
