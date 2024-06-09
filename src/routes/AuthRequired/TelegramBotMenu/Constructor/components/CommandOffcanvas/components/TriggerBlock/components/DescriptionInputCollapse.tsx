import React, { ReactElement, memo } from 'react';

import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';
import Button, { ButtonProps } from 'react-bootstrap/Button';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export type DescriptionInputCollapseProps = Omit<CollapseProps, 'in'>;

const showButtonProps: ButtonProps = {
	variant: 'dark',
	className: 'w-100',
	children: gettext('Добавить в меню'),
};
const hideButtonProps: ButtonProps = {
	variant: 'secondary',
	className: 'w-100 border-bottom-0 rounded rounded-bottom-0',
	children: gettext('Убрать из меню'),
};

function DescriptionInputCollapse({
	children,
	...props
}: DescriptionInputCollapseProps): ReactElement<DescriptionInputCollapseProps> {
	const show = useCommandOffcanvasStore((state) => state.showTriggerDescriptionInput);
	const setShow = useCommandOffcanvasStore(
		(state) => state.setShowTriggerDescriptionInput,
	);

	return (
		<div>
			<Button
				size='sm'
				{...(show ? hideButtonProps : showButtonProps)}
				onClick={() => setShow(!show)}
			/>
			<Collapse {...props} in={show}>
				<div>{children}</div>
			</Collapse>
		</div>
	);
}

export default memo(DescriptionInputCollapse);
