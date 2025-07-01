import React, { LiHTMLAttributes, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { useField } from 'formik';

import cn from 'utils/cn';

import { useCommandOffcanvasStore } from '../../../../../store';

export interface KeyboardButton {
  id?: number;
  draggableId: string;
  text: string;
  url: string | null;
}

export interface DraggableKeyboardButtonProps
  extends Omit<LiHTMLAttributes<HTMLLIElement>, 'children'>,
    Pick<
      DraggableProps,
      'isDragDisabled' | 'disableInteractiveElementBlocking' | 'shouldRespectForcePress'
    > {
  rowIndex: number;
  buttonIndex: number;
}

function DraggableKeyboardButton({
  rowIndex,
  buttonIndex,
  isDragDisabled,
  disableInteractiveElementBlocking,
  shouldRespectForcePress,
  className,
  ...props
}: DraggableKeyboardButtonProps): ReactElement {
  const [{ value: button }] = useField<KeyboardButton>(
    `keyboard.rows[${rowIndex}].buttons[${buttonIndex}]`,
  );

  const select = useCommandOffcanvasStore(
    (state) =>
      state.keyboardButtonBlock.rowIndex === rowIndex &&
      state.keyboardButtonBlock.buttonIndex === buttonIndex,
  );
  const showEditButtonBlock = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.showBlock,
  );
  const hideEditButtonBlock = useCommandOffcanvasStore(
    (state) => state.keyboardButtonBlock.hideBlock,
  );

  function handleClick(): void {
    select ? hideEditButtonBlock() : showEditButtonBlock(button, rowIndex, buttonIndex);
  }

  return (
    <Draggable index={buttonIndex} draggableId={button.draggableId}>
      {({ innerRef, draggableProps, dragHandleProps }) => (
        <li
          {...props}
          {...draggableProps}
          {...dragHandleProps}
          ref={innerRef}
          className={cn(
            'w-full',
            'rounded-sm',
            'text-sm',
            'text-center',
            'px-2',
            'py-1',
            select
              ? ['bg-secondary', 'text-secondary-foreground']
              : ['bg-dark', 'text-dark-foreground'],
            className,
          )}
          onClick={handleClick}
        >
          {button.text}
        </li>
      )}
    </Draggable>
  );
}

export default DraggableKeyboardButton;
