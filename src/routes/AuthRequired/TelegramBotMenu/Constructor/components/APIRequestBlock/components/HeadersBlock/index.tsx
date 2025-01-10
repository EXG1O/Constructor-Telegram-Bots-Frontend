import React, { memo, ReactElement } from 'react';
import classNames from 'classnames';

import { CollapseProps } from 'react-bootstrap/Collapse';

import Stack from 'components/Stack';

import AddHeaderButton from './components/AddHeaderButton';
import BlockCollapse, { BlockCollapseProps } from './components/BlockCollapse';
import HeaderInputGroup from './components/HeaderInputGroup';

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
			<Stack
				{...props}
				gap={1}
				className={classNames(
					'border border-top-0 rounded-1 rounded-top-0 p-1',
					className,
				)}
			>
				{headers.map((_header, index) => (
					<HeaderInputGroup key={index} index={index} />
				))}
				<AddHeaderButton />
			</Stack>
		</BlockCollapse>
	);
}

export default memo(HeadersBlock);
