import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import FormInputFeedback from 'components/FormInputFeedback';
import Stack from 'components/Stack';

import BodyBlock, { Body, defaultBody } from './components/BodyBlock';
import HeadersBlock, { defaultHeaders, Headers } from './components/HeadersBlock';
import MethodButtonGroup, {
	defaultMethod,
	Method,
} from './components/MethodButtonGroup';
import TestBlock from './components/TestBlock';

import Block, { BlockProps } from '../Block';

export interface APIRequest {
	url: string;
	method: Method;
	headers: Headers;
	body: Body;
}

export type APIRequestBlockProps = Omit<BlockProps, 'title' | 'children'>;

export const defaultAPIRequest: APIRequest = {
	url: '',
	method: defaultMethod,
	headers: defaultHeaders,
	body: defaultBody,
};

export {
	defaultBody as defaultAPIRequestBody,
	defaultHeaders as defaultAPIRequestHeaders,
	defaultMethod as defaultAPIRequestMethod,
};

function APIRequestBlock(
	props: APIRequestBlockProps,
): ReactElement<APIRequestBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock',
	});

	return (
		<Block {...props} title={t('title')}>
			<Block.Body as={Stack} gap={2}>
				<FormInputFeedback
					name='api_request.url'
					placeholder={t('urlInputPlaceholder')}
				/>
				<MethodButtonGroup />
				<HeadersBlock />
				<BodyBlock />
				<TestBlock />
			</Block.Body>
		</Block>
	);
}

export default memo(APIRequestBlock);
