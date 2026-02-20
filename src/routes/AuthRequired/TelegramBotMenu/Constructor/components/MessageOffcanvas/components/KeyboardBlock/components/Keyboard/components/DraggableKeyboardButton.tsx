import React, { LiHTMLAttributes, memo, ReactElement } from 'react';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import { FastField, FastFieldProps } from 'formik';

import KeyboardButtonPopover from '../../KeyboardButtonPopover';
import { Style } from '../../KeyboardButtonPopover/components/StyleSelect';
import { Text } from '../../KeyboardButtonPopover/components/TextInput';
import { URL } from '../../KeyboardButtonPopover/components/URLInput';

import cn from 'utils/cn';

import { messageKeyboardButtonStyleVariants } from '../../../../../../../styles/messageKeyboardButtonStyle';

export interface KeyboardButton {
  id?: number;
  draggableId: string;
  text: Text;
  url: URL | null;
  style: Style;
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
                      messageKeyboardButtonStyleVariants({ style: button.style }),
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
