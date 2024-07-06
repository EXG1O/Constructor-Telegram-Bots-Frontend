import React, { memo, ReactElement } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';
import Collapse, { CollapseProps } from 'react-bootstrap/Collapse';

import useCommandOffcanvasStore from '../../../../../hooks/useCommandOffcanvasStore';

export type URLInputCollapseProps = Omit<CollapseProps, 'in'>;

const showButtonProps: ButtonProps = {
	variant: 'dark',
	className: 'w-100 mt-2',
	children: gettext('Добавить URL-адрес'),
};
const hideButtonProps: ButtonProps = {
	variant: 'secondary',
	className: 'w-100 border-bottom-0 rounded rounded-bottom-0 mt-2',
	children: gettext('Удалить URL-адрес'),
};

function URLInputCollapse({
	children,
	...props
}: URLInputCollapseProps): ReactElement<URLInputCollapseProps> {
	const keyboardType = useCommandOffcanvasStore((state) => state.keyboard.type);

	const show = useCommandOffcanvasStore((state) => state.showKeyboardButtonURLInput);
	const setShow = useCommandOffcanvasStore(
		(state) => state.setShowKeyboardButtonURLInput,
	);

	return (
		<div>
			<Collapse in={keyboardType !== 'default'}>
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
			</Collapse>
		</div>
	);
}

export default memo(URLInputCollapse);
