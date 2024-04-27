import React, { ReactElement, memo, useMemo, useState, useCallback } from 'react';

import Form from 'react-bootstrap/Form';

import Block, { BlockProps } from '../Block';

import MethodToggle, { Value as MethodValue } from './components/MethodToggle';
import Headers, { Data as HeadersData } from './components/Headers';
import Body, { Value as BodyData } from './components/Body';
import Test from './components/Test';

export interface Data {
	url: string;
	method: MethodValue;
	headers?: HeadersData;
	body?: BodyData;
}

export interface APIRequestBlockProps extends Omit<BlockProps, 'title' | 'onChange' | 'children'>  {
	data?: Data;
	onChange: (data: Data) => void;
}

export const defaultData: Data = { url: '', method: 'get' };

function APIRequestBlock({ data = defaultData, onChange, ...props }: APIRequestBlockProps): ReactElement<APIRequestBlockProps> {
	const [showHeaders, setShowHeaders] = useState<boolean>(Boolean(data.headers));
	const [showBody, setShowBody] = useState<boolean>(Boolean(data.body));

	return (
		<Block {...props} title={gettext('API-запрос')}>
			<Block.Body className='vstack gap-2'>
				<Form.Control
					value={data.url}
					placeholder={gettext('Введите URL-адрес')}
					onChange={e => onChange({ ...data, url: e.target.value })}
				/>
				<MethodToggle
					value={data.method}
					onChange={useCallback((method: MethodValue) => onChange({ ...data, method }), [])}
				/>
				<Headers
					show={showHeaders}
					data={data.headers}
					onShow={useCallback(() => setShowHeaders(true), [])}
					onHide={useCallback(() => setShowHeaders(false), [])}
					onChange={useCallback(headers => onChange({ ...data, headers }), [])}
				/>
				<Body
					show={showBody}
					value={data.body}
					onShow={useCallback(() => setShowBody(true), [])}
					onHide={useCallback(() => setShowBody(false), [])}
					onChange={useCallback(body => onChange({ ...data, body }), [])}
				/>
				<Test
					url={data.url}
					data={useMemo(() => ({
						method: data.method,
						headers: data.headers?.map(header => [header.key, header.value]),
						body: data.body,
					}), [data])}
				/>
			</Block.Body>
		</Block>
	);
}

export default memo(APIRequestBlock);