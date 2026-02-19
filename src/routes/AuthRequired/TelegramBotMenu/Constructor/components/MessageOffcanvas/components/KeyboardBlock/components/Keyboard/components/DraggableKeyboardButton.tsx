import React, { LiHTMLAttributes, memo, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { FastField, FastFieldProps } from 'formik';

import KeyboardButtonPopover from '../../KeyboardButtonPopover';

import cn from 'utils/cn';

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
  return (
    <FastField name={`keyboard.rows[${rowIndex}].buttons[${buttonIndex}]`}>
      {({ field }: FastFieldProps) => {
        const button: KeyboardButton = field.value;

        return (
          <Draggable index={buttonIndex} draggableId={button.draggableId}>
            {({ innerRef, draggableProps, dragHandleProps }) => (
              <KeyboardButtonPopover
                rowIndex={rowIndex}
                buttonIndex={buttonIndex}
                button={button}
              >
                <KeyboardButtonPopover.Trigger asChild>
                  <li
                    {...props}
                    {...draggableProps}
                    {...dragHandleProps}
                    ref={innerRef}
                    className={cn(
                      'w-full',
                      'bg-dark',
                      'text-dark-foreground',
                      'rounded-sm',
                      'text-sm',
                      'text-center',
                      'px-2',
                      'py-1',
                      className,
                    )}
                  >
                    {button.text}
                  </li>
                </KeyboardButtonPopover.Trigger>
              </KeyboardButtonPopover>
            )}
          </Draggable>
        );
      }}
    </FastField>
  );
}

export default memo(DraggableKeyboardButton);
