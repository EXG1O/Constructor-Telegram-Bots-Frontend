import React, { memo, ReactElement } from 'react';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import { useCommandOffcanvasStore } from '../../../../../store';

export type BlockCollapseProps = Omit<CollapseProps, 'in'>;

function BlockCollapse({
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const show = useCommandOffcanvasStore((state) => state.keyboardButtonBlock.show);

	return (
		<Collapse {...props} in={show}>
			<div>{children}</div>
		</Collapse>
	);
}

export default memo(BlockCollapse);
