import React, { OlHTMLAttributes, ReactElement } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import { useField } from 'formik';

import DraggableKeyboardRow, { KeyboardRow } from './DraggableKeyboardRow';

export interface DroppableKeyboardRowsProps
  extends Omit<OlHTMLAttributes<HTMLOListElement>, 'children'>,
    Pick<
      DroppableProps,
      | 'isDropDisabled'
      | 'isCombineEnabled'
      | 'ignoreContainerClipping'
      | 'renderClone'
      | 'getContainerForClone'
    > {}

function DroppableKeyboardRows({
  isDropDisabled,
  isCombineEnabled,
  ignoreContainerClipping,
  renderClone,
  getContainerForClone,
  ...props
}: DroppableKeyboardRowsProps): ReactElement {
  const [{ value: rows }] = useField<KeyboardRow[]>('keyboard.rows');

  return (
    <Droppable
      droppableId='all-rows'
      direction='vertical'
      type='ROW'
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      ignoreContainerClipping={ignoreContainerClipping}
      renderClone={renderClone}
      getContainerForClone={getContainerForClone}
    >
      {({ innerRef, droppableProps, placeholder }) => (
        <ol {...props} {...droppableProps} ref={innerRef}>
          {rows.map((row, index) => (
            <DraggableKeyboardRow
              key={row.draggableId}
              rowIndex={index}
              className='mb-1'
            />
          ))}
          {placeholder}
        </ol>
      )}
    </Droppable>
  );
}

export default DroppableKeyboardRows;
