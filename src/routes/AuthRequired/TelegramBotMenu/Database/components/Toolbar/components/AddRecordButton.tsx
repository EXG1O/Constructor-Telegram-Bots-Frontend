import React, { ReactElement, memo, useState, useCallback } from 'react';

import AddButton, { AddButtonProps } from 'components/AddButton';

import RecordAdditionModal from '../../RecordAdditionModal';

export type AddVariableButtonProps = Omit<AddButtonProps, 'variant' | 'children'>;

function AddVariableButton({ onClick, ...props }: AddVariableButtonProps): ReactElement<AddVariableButtonProps> {
	const [showModal, setShowModal] = useState<boolean>(false);

	const handleClick = useCallback<NonNullable<AddVariableButtonProps['onClick']>>(event => {
		setShowModal(true);
		onClick?.(event);
	}, [onClick])

	return (
		<>
			<RecordAdditionModal
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<AddButton
				{...props}
				variant='dark'
				onClick={handleClick}
			>
				{gettext('Добавить запись')}
			</AddButton>
		</>
	);
}

export default memo(AddVariableButton);