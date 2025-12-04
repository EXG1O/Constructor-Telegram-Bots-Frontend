import React, { HTMLAttributes, ReactElement } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { FastField, FastFieldProps, FieldInputProps, FormikProps } from 'formik';
import { produce } from 'immer';

import { KeyboardRow } from './components/DraggableKeyboardRow';
import DroppableKeyboardRows from './components/DroppableKeyboardRows';

import { FormValues } from '../../../..';
import { useMessageOffcanvasStore } from '../../../../store';

export type { KeyboardButton } from './components/DraggableKeyboardButton';
export type { KeyboardRow } from './components/DraggableKeyboardRow';

export interface KeyboardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Keyboard(props: KeyboardProps): ReactElement {
  function handleDragEnd(
    form: FormikProps<FormValues>,
    field: FieldInputProps<KeyboardRow[]>,
    { source, destination, type }: DropResult,
  ): void {
    if (!destination) return;

    const rows = field.value;
    const setRows = (newRows: KeyboardRow[]) => form.setFieldValue(field.name, newRows);

    if (type === 'ROW') {
      setRows(
        produce(rows, (draft) => {
          const [movedRow] = draft.splice(source.index, 1);
          draft.splice(destination.index, 0, movedRow);
        }),
      );

      const {
        keyboardButtonBlock: { rowIndex, setRowIndex },
      } = useMessageOffcanvasStore.getState();

      if (rowIndex !== null) {
        setRowIndex(destination.index);
      }
    } else if (source.droppableId === destination.droppableId) {
      setRows(
        produce(rows, (draft) => {
          const row = draft.find((row) => row.draggableId === source.droppableId)!;

          const [movedButton] = row.buttons.splice(source.index, 1);
          row.buttons.splice(destination.index, 0, movedButton);
        }),
      );

      const {
        keyboardButtonBlock: { buttonIndex, setButtonIndex },
      } = useMessageOffcanvasStore.getState();

      if (buttonIndex !== null) {
        setButtonIndex(destination.index);
      }
    } else {
      setRows(
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
        keyboardButtonBlock: { rowIndex, buttonIndex, setRowIndex, setButtonIndex },
      } = useMessageOffcanvasStore.getState();

      if (rowIndex !== null && buttonIndex !== null) {
        setRowIndex(
          rows.findIndex((row) => row.draggableId === destination.droppableId),
        );
        setButtonIndex(destination.index);
      }
    }
  }

  return (
    <FastField name='keyboard.rows'>
      {({ field, form }: FastFieldProps) => {
        const rows: KeyboardRow[] = field.value;

        return rows.length ? (
          <div {...props}>
            <DragDropContext onDragEnd={(result) => handleDragEnd(form, field, result)}>
              <DroppableKeyboardRows />
            </DragDropContext>
          </div>
        ) : null;
      }}
    </FastField>
  );
}

export default Keyboard;
