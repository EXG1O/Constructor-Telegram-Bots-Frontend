import React, { memo, ReactElement } from 'react';

import BaseAPIRequestBlock, {
	APIRequest,
	APIRequestBlockProps as BaseAPIRequestBlockProps,
	defaultAPIRequest,
} from '../../APIRequestBlock';
import Block from '../../Block';

export type APIRequestBlockProps = Pick<BaseAPIRequestBlockProps, 'className'>;

export type { APIRequest };
export { defaultAPIRequest };

function APIRequestBlock(
	props: APIRequestBlockProps,
): ReactElement<APIRequestBlockProps> {
	return (
		<Block.Collapse name='show_api_request_block'>
			<BaseAPIRequestBlock {...props} />
		</Block.Collapse>
	);
}

export default memo(APIRequestBlock);
