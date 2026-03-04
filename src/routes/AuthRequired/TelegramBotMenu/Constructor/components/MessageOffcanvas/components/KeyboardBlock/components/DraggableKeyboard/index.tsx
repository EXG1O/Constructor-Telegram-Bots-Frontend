import React, { type HTMLAttributes, type ReactElement } from 'react';
import { DragDropContext, type DropResult } from 'react-beautiful-dnd';
import {
  FastField,
  type FastFieldProps,
  type FieldInputProps,
  type FormikProps,
} from 'formik';
import { produce } from 'immer';

import type { KeyboardRow } from './components/DraggableKeyboardRow';
import DroppableKeyboardRows from './components/DroppableKeyboardRows';

import type { FormValues } from '../../../..';

export type { KeyboardButton } from './components/DraggableKeyboardButton';
export type { KeyboardRow } from './components/DraggableKeyboardRow';

export interface DraggableKeyboardProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

function DraggableKeyboard(props: DraggableKeyboardProps): ReactElement {
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
    } else if (source.droppableId === destination.droppableId) {
      setRows(
        produce(rows, (draft) => {
          const row = draft.find((row) => row.draggableId === source.droppableId)!;

          const [movedButton] = row.buttons.splice(source.index, 1);
          row.buttons.splice(destination.index, 0, movedButton);
        }),
      );
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

export default DraggableKeyboard;
