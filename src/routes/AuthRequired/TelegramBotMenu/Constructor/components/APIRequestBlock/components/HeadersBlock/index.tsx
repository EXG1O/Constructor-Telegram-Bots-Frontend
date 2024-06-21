import React, { ReactElement, memo } from 'react';
import classNames from 'classnames';

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

export type HeadersBlockProps = Omit<
	BlockCollapseProps,
	keyof Omit<CollapseProps, 'className'>
>;

export const defaultHeaders: Headers = [];

function HeadersBlock({
	className,
	...props
}: HeadersBlockProps): ReactElement<HeadersBlockProps> {
	const headers = useAPIRequestBlockStore((state) => state.apiRequest.headers);

	return (
		<BlockCollapse>
			<div
				{...props}
				className={classNames(
					'vstack border border-top-0 rounded-1 rounded-top-0 gap-1 p-1',
					className,
				)}
			>
				{headers.map((_header, index) => (
					<HeaderInputGroup key={index} index={index} />
				))}
				<AddHeaderButton />
			</div>
		</BlockCollapse>
	);
}

export default memo(HeadersBlock);
