import React, { LiHTMLAttributes, memo, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { FastField, FastFieldProps } from 'formik';

import cn from 'utils/cn';

import { useMessageOffcanvasStore } from '../../../../../store';

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
  const select = useMessageOffcanvasStore(
    (state) =>
      state.keyboardButtonBlock.rowIndex === rowIndex &&
      state.keyboardButtonBlock.buttonIndex === buttonIndex,
  );
  const showEditButtonBlock = useMessageOffcanvasStore(
    (state) => state.keyboardButtonBlock.showBlock,
  );
  const hideEditButtonBlock = useMessageOffcanvasStore(
    (state) => state.keyboardButtonBlock.hideBlock,
  );

  function handleClick(button: KeyboardButton): void {
    select ? hideEditButtonBlock() : showEditButtonBlock(button, rowIndex, buttonIndex);
  }

  return (
    <FastField name={`keyboard.rows[${rowIndex}].buttons[${buttonIndex}]`}>
      {({ field }: FastFieldProps) => {
        const button: KeyboardButton = field.value;

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
                onClick={() => handleClick(button)}
              >
                {button.text}
              </li>
            )}
          </Draggable>
        );
      }}
    </FastField>
  );
}

export default memo(DraggableKeyboardButton);
