import React, { ReactElement, useMemo, useCallback } from 'react';

import Modal, { ModalProps } from 'components/Modal';
import MonacoEditor, { MonacoEditorProps } from 'components/MonacoEditor';

export type Value = string;

export interface RecordFormModalProps extends ModalProps {
	value: Value;
	title: string;
	onChange: (value: Value) => void;
	onHide: NonNullable<ModalProps['onHide']>;
}

export const defaultValue: Value = JSON.stringify({ key: 'value' }, undefined, 4);

function RecordFormModal({ value, title, onChange, children, ...props }: RecordFormModalProps): ReactElement<RecordFormModalProps> {
	return (
		<Modal {...props}>
			<Modal.Header closeButton>
				<Modal.Title as='h5'>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<MonacoEditor
					value={value}
					language='json'
					options={useMemo(() => ({
						glyphMargin: false,
						folding: false,
						lineNumbers: 'off',
						lineDecorationsWidth: 0,
						lineNumbersMinChars: 0,
					}), [])}
					onChange={useCallback<NonNullable<MonacoEditorProps['onChange']>>((editor, newValue) => onChange(newValue), [])}
				/>
			</Modal.Body>
			{children}
		</Modal>
	);
}

export default Object.assign(RecordFormModal, { Footer: Modal.Footer });