import React, { LiHTMLAttributes, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { useField } from 'formik';
import { produce } from 'immer';
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
  const [{ value: rows }, _meta, { setValue: setRows }] =
    useField<KeyboardRow[]>('keyboard.rows');
  const [{ value: row }] = useField<KeyboardRow>(`keyboard.rows[${rowIndex}]`);

  function handleDeleteClick(): void {
    setRows(
      produce(rows, (draft) => {
        draft.splice(rowIndex, 1);
      }),
    );
  }

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
          <DroppableKeyboardButtons rowIndex={rowIndex} className='h-full flex-auto' />
          <IconButton size='sm' className='text-danger' onClick={handleDeleteClick}>
            <Trash2 />
          </IconButton>
        </li>
      )}
    </Draggable>
  );
}

export default DraggableKeyboardRow;
