import React, { ReactElement, memo, useState, useCallback } from 'react';

import AddButton, { AddButtonProps } from 'components/AddButton';

import CommandAdditionOffcanvas from '../../CommandAdditionOffcanvas';

export type AddCommandButtonProps = Omit<AddButtonProps, 'variant' | 'children'>;

function AddCommandButton({ onClick, ...props }: AddCommandButtonProps): ReactElement<AddCommandButtonProps> {
	const [showModal, setShowModal] = useState<boolean>(false);

	const handleClick = useCallback<NonNullable<AddButtonProps['onClick']>>(event => {
		setShowModal(true);
		onClick?.(event);
	}, [onClick]);

	return (
		<>
			<CommandAdditionOffcanvas
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<AddButton
				{...props}
				variant='dark'
				onClick={handleClick}
			>
				{gettext('Добавить команду')}
			</AddButton>
		</>
	);
}

export default memo(AddCommandButton);