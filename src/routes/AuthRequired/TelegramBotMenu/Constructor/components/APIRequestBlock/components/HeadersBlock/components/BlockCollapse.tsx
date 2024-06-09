import React, { HTMLAttributes, ReactElement, memo } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';
import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import useAPIRequestBlockStore from '../../../hooks/useAPIRequestBlockStore';

export type BlockCollapseProps = Omit<CollapseProps, 'in'> &
	Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

const showButtonProps: ButtonProps = {
	variant: 'dark',
	className: 'w-100',
	children: gettext('Добавить заголовки'),
};
const hideButtonProps: ButtonProps = {
	variant: 'secondary',
	className: 'w-100 border-bottom-0 rounded-bottom-0',
	children: gettext('Убрать заголовки'),
};

function BlockCollapse({
	mountOnEnter,
	unmountOnExit,
	appear,
	timeout,
	dimension,
	getDimensionValue,
	children,
	...props
}: BlockCollapseProps): ReactElement<BlockCollapseProps> {
	const show = useAPIRequestBlockStore((state) => state.showAPIRequestHeadersBlock);
	const setShow = useAPIRequestBlockStore(
		(state) => state.setShowAPIRequestHeadersBlock,
	);

	return (
		<div {...props}>
			<Button
				size='sm'
				{...(show ? hideButtonProps : showButtonProps)}
				onClick={() => setShow(!show)}
			/>
			<Collapse
				in={show}
				mountOnEnter={mountOnEnter}
				unmountOnExit={unmountOnExit}
				appear={appear}
				timeout={timeout}
				dimension={dimension}
				getDimensionValue={getDimensionValue}
			>
				<div>{children}</div>
			</Collapse>
		</div>
	);
}

export default memo(BlockCollapse);
