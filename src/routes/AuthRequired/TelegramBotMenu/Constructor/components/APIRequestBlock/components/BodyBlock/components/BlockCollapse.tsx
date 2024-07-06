import React, { memo, ReactElement } from 'react';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import useAPIRequestBlockStore from '../../../hooks/useAPIRequestBlockStore';

export type BlockCollapseProps = Omit<CollapseProps, 'in'>;

function BlockCollapse({
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const show = useAPIRequestBlockStore((state) => state.apiRequest.method !== 'get');

	return (
		<Collapse {...props} in={show}>
			<div>{children}</div>
		</Collapse>
	);
}

export default memo(BlockCollapse);
