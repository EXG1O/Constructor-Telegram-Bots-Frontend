import React, { ReactElement, memo, useState, useCallback } from 'react';

import AddButton, { AddButtonProps } from 'components/AddButton';

import VariableAdditionModal from '../../VariableAdditionModal';

export type AddVariableButtonProps = Omit<AddButtonProps, 'children'>;

function AddVariableButton(props: AddVariableButtonProps): ReactElement<AddVariableButtonProps> {
	const [showModal, setShowModal] = useState<boolean>(false);

	return (
		<>
			<VariableAdditionModal
				show={showModal}
				onHide={useCallback(() => setShowModal(false), [])}
			/>
			<AddButton
				{...props}
				onClick={useCallback(() => setShowModal(true), [])}
			>
				{gettext('Добавить переменную')}
			</AddButton>
		</>
	);
}

export default memo(AddVariableButton);