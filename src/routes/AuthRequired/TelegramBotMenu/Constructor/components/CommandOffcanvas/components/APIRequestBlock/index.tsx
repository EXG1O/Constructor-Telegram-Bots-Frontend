import React, { memo, ReactElement } from 'react';

import Collapse from 'react-bootstrap/Collapse';

import BaseAPIRequestBlock, {
	APIRequestBlockProps as BaseAPIRequestBlockProps,
	defaultAPIRequest,
	defaultAPIRequestBody,
	defaultAPIRequestHeaders,
	defaultAPIRequestMethod,
	defaultAPIRequestURL,
} from '../../../APIRequestBlock';

import useCommandOffcanvasStore from '../../hooks/useCommandOffcanvasStore';

export type APIRequestBlockProps = Omit<BaseAPIRequestBlockProps, 'store'>;

export {
	defaultAPIRequest,
	defaultAPIRequestBody,
	defaultAPIRequestHeaders,
	defaultAPIRequestMethod,
	defaultAPIRequestURL,
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
