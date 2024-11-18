import React, { memo, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

import { RouteID } from 'routes';

import BodyBlock, { Body, defaultBody } from './components/BodyBlock';
import HeadersBlock, { defaultHeaders, Headers } from './components/HeadersBlock';
import MethodButtonGroup, {
	defaultMethod,
	Method,
} from './components/MethodButtonGroup';
import TestBlock from './components/TestBlock';
import URLInput, { defaultURL, URL } from './components/URLInput';
import StoreContext, { StoreContextType } from './contexts/StoreContext';

import Block, { BlockProps } from '../Block';

export interface APIRequest {
	url: URL;
	method: Method;
	headers: Headers;
	body: Body;
}

export interface APIRequestBlockProps extends Omit<BlockProps, 'title' | 'children'> {
	store: StoreContextType;
}

export const defaultAPIRequest: APIRequest = {
	url: defaultURL,
	method: defaultMethod,
	headers: defaultHeaders,
	body: defaultBody,
};

export {
	defaultBody as defaultAPIRequestBody,
	defaultHeaders as defaultAPIRequestHeaders,
	defaultMethod as defaultAPIRequestMethod,
	defaultURL as defaultAPIRequestURL,
};

function APIRequestBlock({
	store,
	...props
}: APIRequestBlockProps): ReactElement<APIRequestBlockProps> {
	const { t } = useTranslation(RouteID.TelegramBotMenuConstructor, {
		keyPrefix: 'apiRequestBlock',
	});

	return (
		<Block {...props} title={t('title')}>
			<Block.Body className='vstack gap-2'>
				<StoreContext.Provider value={store}>
					<URLInput />
					<MethodButtonGroup />
					<HeadersBlock />
					<BodyBlock />
					<TestBlock />
				</StoreContext.Provider>
			</Block.Body>
		</Block>
	);
}

export default memo(APIRequestBlock);
