import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useField } from 'formik';
import { produce } from 'immer';

import { KeyboardRow } from './components/DraggableKeyboardRow';
import DroppableKeyboardRows from './components/DroppableKeyboardRows';

import { useCommandOffcanvasStore } from '../../../../store';

export type { KeyboardButton } from './components/DraggableKeyboardButton';
export type { KeyboardRow } from './components/DraggableKeyboardRow';

export type KeyboardProps = Pick<HTMLAttributes<HTMLDivElement>, 'className'>;

function Keyboard(props: KeyboardProps): ReactElement<KeyboardProps> | null {
	const [{ value: rows }, _meta, { setValue }] =
		useField<KeyboardRow[]>('keyboard.rows');

	function handleDragEnd({ source, destination, type }: DropResult): void {
		if (!destination) return;

		if (type === 'ROW') {
			setValue(
				produce(rows, (draft) => {
					const [movedRow] = draft.splice(source.index, 1);
					draft.splice(destination.index, 0, movedRow);
				}),
			);

			const {
				keyboardButtonBlock: { rowIndex, setRowIndex },
			} = useCommandOffcanvasStore.getState();

			if (rowIndex !== null) {
				setRowIndex(destination.index);
			}
		} else if (source.droppableId === destination.droppableId) {
			setValue(
				produce(rows, (draft) => {
					const row = draft.find(
						(row) => row.draggableId === source.droppableId,
					)!;

					const [movedButton] = row.buttons.splice(source.index, 1);
					row.buttons.splice(destination.index, 0, movedButton);
				}),
			);

			const {
				keyboardButtonBlock: { buttonIndex, setButtonIndex },
			} = useCommandOffcanvasStore.getState();

			if (buttonIndex !== null) {
				setButtonIndex(destination.index);
			}
		} else {
			setValue(
				produce(rows, (draft) => {
					const sourceRowIndex = draft.findIndex(
						(row) => row.draggableId === source.droppableId,
					);
					const sourceRow =
						draft[sourceRowIndex].buttons.length - 1
							? draft[sourceRowIndex]
							: draft.splice(sourceRowIndex, 1)[0];
					const destRow = draft.find(
						(row) => row.draggableId === destination.droppableId,
					)!;

					const [movedButton] = sourceRow.buttons.splice(source.index, 1);
					destRow.buttons.splice(destination.index, 0, movedButton);
				}),
			);

			const {
				keyboardButtonBlock: {
					rowIndex,
					buttonIndex,
					setRowIndex,
					setButtonIndex,
				},
			} = useCommandOffcanvasStore.getState();

			if (rowIndex !== null && buttonIndex !== null) {
				setRowIndex(
					rows.findIndex(
						(row) => row.draggableId === destination.droppableId,
					),
				);
				setButtonIndex(destination.index);
			}
		}
	}

	return rows.length ? (
		<div {...props}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<DroppableKeyboardRows />
			</DragDropContext>
		</div>
	) : null;
}

export default memo(Keyboard);
