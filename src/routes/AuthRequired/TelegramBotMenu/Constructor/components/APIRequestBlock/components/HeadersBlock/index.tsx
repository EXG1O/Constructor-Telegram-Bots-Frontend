import React, { ReactElement, memo } from 'react';

import { CollapseProps } from 'react-bootstrap/Collapse';

import BlockCollapse, { BlockCollapseProps } from './components/BlockCollapse';
import HeaderInputGroup from './components/HeaderInputGroup';
import AddHeaderButton from './components/AddHeaderButton';

import useAPIRequestBlockStore from '../../hooks/useAPIRequestBlockStore';

export interface Header {
	key: string;
	value: string;
}

export type Headers = Header[];

export type HeadersBlockProps = Omit<BlockCollapseProps, keyof CollapseProps>;

export const defaultHeaders: Headers = [];

function HeadersBlock(props: HeadersBlockProps): ReactElement<HeadersBlockProps> {
	const headers = useAPIRequestBlockStore((state) => state.apiRequest.headers);

	return (
		<BlockCollapse unmountOnExit>
			<div className='vstack border rounded-1 gap-1 p-1'>
				{headers.map((header, index) => (
					<HeaderInputGroup key={index} index={index} />
				))}
				<AddHeaderButton />
			</div>
		</BlockCollapse>
	);
}

export default memo(HeadersBlock);
