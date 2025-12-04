import React, { memo, OlHTMLAttributes, ReactElement } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import { FastField, FastFieldProps } from 'formik';

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
        <FastField name='keyboard.rows'>
          {({ field }: FastFieldProps<KeyboardRow[]>) => (
            <ol {...props} {...droppableProps} ref={innerRef}>
              {field.value.map((row, index) => (
                <DraggableKeyboardRow
                  key={row.draggableId}
                  rowIndex={index}
                  className='mb-1'
                />
              ))}
              {placeholder}
            </ol>
          )}
        </FastField>
      )}
    </Droppable>
  );
}

export default memo(DroppableKeyboardRows);
