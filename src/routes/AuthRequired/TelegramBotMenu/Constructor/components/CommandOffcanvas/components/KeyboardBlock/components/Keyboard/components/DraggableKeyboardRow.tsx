import React, { LiHTMLAttributes, memo, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { FastField, FastFieldProps, FormikProps } from 'formik';
import { produce } from 'immer';
import { LayoutGrid, Trash2 } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import { KeyboardButton } from './DraggableKeyboardButton';
import DroppableKeyboardButtons from './DroppableKeyboardButtons';

import cn from 'utils/cn';

import { FormValues } from '../../../../..';

export interface KeyboardRow {
  draggableId: string;
  buttons: KeyboardButton[];
}

export interface DraggableKeyboardRowProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'>,
    Pick<
      DraggableProps,
      'isDragDisabled' | 'disableInteractiveElementBlocking' | 'shouldRespectForcePress'
    > {
  rowIndex: number;
}

function DraggableKeyboardRow({
  rowIndex,
  isDragDisabled,
  disableInteractiveElementBlocking,
  shouldRespectForcePress,
  className,
  ...props
}: DraggableKeyboardRowProps): ReactElement {
  function handleDeleteClick(form: FormikProps<FormValues>): void {
    const field = form.getFieldProps<KeyboardRow[]>('keyboard.rows');
    form.setFieldValue(
      field.name,
      produce(field.value, (draft) => {
        draft.splice(rowIndex, 1);
      }),
    );
  }

  return (
    <FastField name={`keyboard.rows[${rowIndex}]`}>
      {({ field, form }: FastFieldProps) => {
        const row: KeyboardRow = field.value;

        return (
          <Draggable
            draggableId={row.draggableId}
            index={rowIndex}
            isDragDisabled={isDragDisabled}
            disableInteractiveElementBlocking={disableInteractiveElementBlocking}
            shouldRespectForcePress={shouldRespectForcePress}
          >
            {({ innerRef, draggableProps, dragHandleProps }) => (
              <li
                {...props}
                {...draggableProps}
                {...dragHandleProps}
                ref={innerRef}
                className={cn(
                  'flex',
                  'items-center',
                  'h-9',
                  'bg-light-accent',
                  'text-light-foreground',
                  'rounded-sm',
                  'p-1',
                  'gap-1',
                  className,
                )}
              >
                <IconButton size='sm' className='cursor-grab'>
                  <LayoutGrid />
                </IconButton>
                <DroppableKeyboardButtons
                  rowIndex={rowIndex}
                  className='h-full flex-auto'
                />
                <IconButton
                  size='sm'
                  className='text-danger'
                  onClick={() => handleDeleteClick(form)}
                >
                  <Trash2 />
                </IconButton>
              </li>
            )}
          </Draggable>
        );
      }}
    </FastField>
  );
}

export default memo(DraggableKeyboardRow);
