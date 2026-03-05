import React, { memo, type OlHTMLAttributes, type ReactElement } from 'react';
import { Droppable, type DroppableProps } from 'react-beautiful-dnd';
import { FastField, type FastFieldProps } from 'formik';

import DraggableKeyboardRow, { type KeyboardRow } from './DraggableKeyboardRow';

import cn from 'utils/cn';

export interface DroppableKeyboardRowsProps
  extends
    Omit<OlHTMLAttributes<HTMLOListElement>, 'children'>,
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
  className,
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
            <ol
              {...props}
              {...droppableProps}
              ref={innerRef}
              className={cn('w-full', '-mb-1', className)}
            >
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
