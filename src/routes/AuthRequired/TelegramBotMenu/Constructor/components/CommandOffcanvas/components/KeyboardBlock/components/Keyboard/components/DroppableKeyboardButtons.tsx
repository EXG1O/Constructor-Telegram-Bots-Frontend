import React, { OlHTMLAttributes, ReactElement } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import { useField } from 'formik';

import DraggableKeyboardButton from './DraggableKeyboardButton';
import { KeyboardRow } from './DraggableKeyboardRow';

import cn from 'utils/cn';

export interface DroppableKeyboardButtonsProps
  extends Omit<OlHTMLAttributes<HTMLOListElement>, 'children'>,
    Pick<
      DroppableProps,
      | 'isDropDisabled'
      | 'isCombineEnabled'
      | 'ignoreContainerClipping'
      | 'renderClone'
      | 'getContainerForClone'
    > {
  rowIndex: number;
}

function DroppableKeyboardButtons({
  rowIndex,
  isDropDisabled,
  isCombineEnabled,
  ignoreContainerClipping,
  renderClone,
  getContainerForClone,
  className,
  ...props
}: DroppableKeyboardButtonsProps): ReactElement<DroppableKeyboardButtonsProps> {
  const [{ value: row }] = useField<KeyboardRow>(`keyboard.rows[${rowIndex}]`);

  return (
    <Droppable
      droppableId={row.draggableId}
      direction='horizontal'
      type='BUTTON'
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      ignoreContainerClipping={ignoreContainerClipping}
      renderClone={renderClone}
      getContainerForClone={getContainerForClone}
    >
      {({ innerRef, droppableProps, placeholder }) => (
        <ol
          {...props}
          {...droppableProps}
          ref={innerRef}
          className={cn(
            'flex',
            '-mr-1',
            'overflow-x-auto',
            'scrollbar-thin',
            className,
          )}
        >
          {row.buttons.map((button, index) => (
            <DraggableKeyboardButton
              key={button.draggableId}
              rowIndex={rowIndex}
              buttonIndex={index}
              className='mr-1'
            />
          ))}
          {placeholder}
        </ol>
      )}
    </Droppable>
  );
}

export default DroppableKeyboardButtons;
