import React, { LiHTMLAttributes, memo, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { FastField, FastFieldProps, FieldArray } from 'formik';
import { LayoutGrid, Trash2 } from 'lucide-react';

import IconButton from 'components/ui/IconButton';

import { KeyboardButton } from './DraggableKeyboardButton';
import DroppableKeyboardButtons from './DroppableKeyboardButtons';

import cn from 'utils/cn';

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
  return (
    <FastField name={`keyboard.rows[${rowIndex}]`}>
      {({ field }: FastFieldProps) => {
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
                <FieldArray name='keyboard.rows'>
                  {({ remove }) => (
                    <IconButton
                      size='sm'
                      className='text-danger'
                      onClick={() => remove(rowIndex)}
                    >
                      <Trash2 />
                    </IconButton>
                  )}
                </FieldArray>
              </li>
            )}
          </Draggable>
        );
      }}
    </FastField>
  );
}

export default memo(DraggableKeyboardRow);
