import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useField } from 'formik';

import { RouteID } from 'routes';

import { Header } from '..';

import Button, { ButtonProps } from 'components/Button';

export type AddHeaderButtonProps = Pick<ButtonProps, 'className'>;

function AddHeaderButton(
	props: AddHeaderButtonProps,
): ReactElement<AddHeaderButtonProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock.headersBlock.addHeaderButton',
	});

	const [{ value: headers }, _meta, { setValue }] =
		useField<Header[]>('api_request.headers');

	function handleClick() {
		setValue([...headers, { key: '', value: '' }]);
	}

	return (
		<Button {...props} size='sm' variant='dark' onClick={handleClick}>
			{t('text')}
		</Button>
	);
}

export default memo(AddHeaderButton);
