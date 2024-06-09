import React, { ReactElement, memo } from 'react';

import Collapse from 'react-bootstrap/Collapse';

import BaseAPIRequestBlock, {
	APIRequestBlockProps as BaseAPIRequestBlockProps,
	defaultAPIRequest,
	defaultAPIRequestURL,
	defaultAPIRequestMethod,
	defaultAPIRequestHeaders,
	defaultAPIRequestBody,
} from '../../../APIRequestBlock';

import useCommandOffcanvasStore from '../../hooks/useCommandOffcanvasStore';

export type APIRequestBlockProps = Omit<BaseAPIRequestBlockProps, 'store'>;

export {
	defaultAPIRequest,
	defaultAPIRequestURL,
	defaultAPIRequestMethod,
	defaultAPIRequestHeaders,
	defaultAPIRequestBody,
};

function APIRequestBlock(
	props: APIRequestBlockProps,
): ReactElement<APIRequestBlockProps> {
	const store = useCommandOffcanvasStore();
	const show = useCommandOffcanvasStore((state) => state.showAPIRequestBlock);

	return (
		<Collapse in={show}>
			<div>
				<BaseAPIRequestBlock {...props} store={store} />
			</div>
		</Collapse>
	);
}

export default memo(APIRequestBlock);
