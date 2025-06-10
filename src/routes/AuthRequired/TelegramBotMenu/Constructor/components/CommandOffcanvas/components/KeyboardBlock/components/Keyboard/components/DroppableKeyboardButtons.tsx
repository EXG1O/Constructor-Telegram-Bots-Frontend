import React, { CSSProperties, HTMLAttributes, memo, ReactElement } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { useField } from 'formik';

import DraggableKeyboardButton from './DraggableKeyboardButton';
import { KeyboardRow } from './DraggableKeyboardRow';

export interface DroppableKeyboardButtonsProps
  extends Pick<
      DroppableProps,
      | 'isDropDisabled'
      | 'isCombineEnabled'
      | 'ignoreContainerClipping'
      | 'renderClone'
      | 'getContainerForClone'
    >,
    Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'style'> {
  rowIndex: number;
}

const blockStyle: CSSProperties = { minHeight: 41 };

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
        <div
          ref={innerRef}
          {...props}
          {...droppableProps}
          className={classNames(
            'd-flex bg-light overflow-auto',
            className,
          )}
          style={blockStyle}
        >
          {row.buttons.map((button, index) => (
            <DraggableKeyboardButton
              key={button.draggableId}
              rowIndex={rowIndex}
              buttonIndex={index}
            />
          ))}
          {placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default memo(DroppableKeyboardButtons);
