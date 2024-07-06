import React, { HTMLAttributes, memo, ReactElement } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';

import DroppableKeyboardRows from './components/DroppableKeyboardRows';

import useCommandOffcanvasStore from '../../../../hooks/useCommandOffcanvasStore';

export type { KeyboardButton } from './components/DraggableKeyboardButton';
export type { KeyboardRow } from './components/DraggableKeyboardRow';

export type KeyboardProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'>;

function Keyboard(props: KeyboardProps): ReactElement<KeyboardProps> {
	const store = useCommandOffcanvasStore();
	const rows = useCommandOffcanvasStore((state) => state.keyboard.rows);
	const updateKeyboard = useCommandOffcanvasStore((state) => state.updateKeyboard);

	function handleDragEnd({ source, destination, type }: DropResult): void {
		if (!destination) return;

		if (type === 'ROW') {
			updateKeyboard((keyboard) => {
				const [movedRow] = keyboard.rows.splice(source.index, 1);
				keyboard.rows.splice(destination.index, 0, movedRow);
			});

			const { keyboardRowIndex } = store.getState();

			if (keyboardRowIndex !== null) {
				store.setState({ keyboardRowIndex: destination.index });
			}
		} else if (source.droppableId === destination.droppableId) {
			updateKeyboard((keyboard) => {
				const row = keyboard.rows.find(
					(row) => row.draggableId === source.droppableId,
				)!;

				const [movedButton] = row.buttons.splice(source.index, 1);
				row.buttons.splice(destination.index, 0, movedButton);
			});

			const { keyboardButtonIndex } = store.getState();

			if (keyboardButtonIndex !== null) {
				store.setState({ keyboardButtonIndex: destination.index });
			}
		} else {
			updateKeyboard((keyboard) => {
				const sourceRowIndex = keyboard.rows.findIndex(
					(row) => row.draggableId === source.droppableId,
				);
				const sourceRow =
					keyboard.rows[sourceRowIndex].buttons.length - 1
						? keyboard.rows[sourceRowIndex]
						: keyboard.rows.splice(sourceRowIndex, 1)[0];
				const destRow = keyboard.rows.find(
					(row) => row.draggableId === destination.droppableId,
				)!;

				const [movedButton] = sourceRow.buttons.splice(source.index, 1);
				destRow.buttons.splice(destination.index, 0, movedButton);
			});

			const { keyboard, keyboardRowIndex, keyboardButtonIndex } =
				store.getState();

			if (keyboardRowIndex !== null && keyboardButtonIndex !== null) {
				store.setState({
					keyboardRowIndex: keyboard.rows.findIndex(
						(row) => row.draggableId === destination.droppableId,
					),
					keyboardButtonIndex: destination.index,
				});
			}
		}
	}

	return rows.length ? (
		<div {...props}>
			<DragDropContext onDragEnd={handleDragEnd}>
				<DroppableKeyboardRows />
			</DragDropContext>
		</div>
	) : (
		<></>
	);
}

export default memo(Keyboard);
