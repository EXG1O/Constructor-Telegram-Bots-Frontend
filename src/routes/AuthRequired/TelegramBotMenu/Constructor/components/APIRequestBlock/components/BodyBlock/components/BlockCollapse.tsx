import React, { memo, ReactElement, useMemo } from 'react';
import { useField } from 'formik';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import { Method } from '../../MethodButtonGroup';

export type BlockCollapseProps = Omit<CollapseProps, 'in'>;

function BlockCollapse({
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const [{ value: method }] = useField<Method>('api_request.method');
	const show = useMemo<boolean>(() => method !== 'get', [method]);

	return (
		<Collapse {...props} in={show}>
			<div>{children}</div>
		</Collapse>
	);
}

export default memo(BlockCollapse);
