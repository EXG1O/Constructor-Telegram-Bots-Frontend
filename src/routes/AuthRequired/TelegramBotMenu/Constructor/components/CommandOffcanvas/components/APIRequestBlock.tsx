import React, { memo, ReactElement } from 'react';
import { useField } from 'formik';

import Collapse from 'react-bootstrap/Collapse';

import BaseAPIRequestBlock, {
	APIRequest,
	APIRequestBlockProps as BaseAPIRequestBlockProps,
	defaultAPIRequest,
} from '../../APIRequestBlock';

export type APIRequestBlockProps = Pick<BaseAPIRequestBlockProps, 'className'>;

export type { APIRequest };
export { defaultAPIRequest };

function APIRequestBlock(
	props: APIRequestBlockProps,
): ReactElement<APIRequestBlockProps> {
	const [{ value: show }] = useField<boolean>('show_api_request_block');

	return (
		<Collapse in={show}>
			<div>
				<BaseAPIRequestBlock {...props} />
			</div>
		</Collapse>
	);
}

export default memo(APIRequestBlock);
