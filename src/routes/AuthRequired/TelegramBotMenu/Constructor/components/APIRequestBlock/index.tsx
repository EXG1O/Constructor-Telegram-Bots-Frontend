import React, { ReactElement, memo } from 'react';

import Block, { BlockProps } from '../Block';

import BodyBlock, { Body, defaultBody } from './components/BodyBlock';
import HeadersBlock, { Headers, defaultHeaders } from './components/HeadersBlock';
import MethodButtonGroup, {
	Method,
	defaultMethod,
} from './components/MethodButtonGroup';
import TestBlock from './components/TestBlock';
import URLInput, { URL, defaultURL } from './components/URLInput';

import StoreContext, { StoreContextType } from './contexts/StoreContext';

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
	defaultURL as defaultAPIRequestURL,
	defaultMethod as defaultAPIRequestMethod,
	defaultHeaders as defaultAPIRequestHeaders,
	defaultBody as defaultAPIRequestBody,
};

function APIRequestBlock({
	store,
	...props
}: APIRequestBlockProps): ReactElement<APIRequestBlockProps> {
	return (
		<Block {...props} title={gettext('API-запрос')}>
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
