import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { RouteID } from 'routes';

import InputFeedback, { InputFeedbackProps } from 'components/InputFeedback';

import { useCommandOffcanvasStore } from '../../../../../store';

export type URLInputProps = Omit<
	InputFeedbackProps,
	'size' | 'value' | 'placeholder' | 'children' | 'onChange'
>;

export type URL = string;

export const defaultURL: URL = '';

function URLInput({ className, ...props }: URLInputProps): ReactElement<URLInputProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'commandOffcanvas.keyboardBlock.keyboardButtonBlock.urlInput',
	});

	const url = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.url);
	const setURL = useCommandOffcanvasStore(
		(state) => state.keyboardButtonBlock.setURL,
	);
	const error = useCommandOffcanvasStore(
		(state) => state.keyboardButtonBlock.errors.url,
	);

	return (
		<InputFeedback
			{...props}
			size='sm'
			value={url}
			error={error}
			className={classNames('border-top-0 rounded-top-0', className)}
			placeholder={t('placeholder')}
			onChange={(e) => setURL(e.target.value)}
		/>
	);
}

export default memo(URLInput);
