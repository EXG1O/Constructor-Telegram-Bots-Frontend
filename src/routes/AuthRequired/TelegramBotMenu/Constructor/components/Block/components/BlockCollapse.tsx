import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

export interface BlockCollapseProps extends Omit<CollapseProps, 'in'> {
	name: string;
}

function BlockCollapse({
	name,
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const [{ value: show }] = useField<boolean>(name);

	return (
		<Collapse {...props} in={show}>
			<div>{children}</div>
		</Collapse>
	);
}

export default BlockCollapse;
