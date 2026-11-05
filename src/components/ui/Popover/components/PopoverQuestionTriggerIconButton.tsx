import React, { forwardRef } from 'react';

import IconButton, { type IconButtonProps } from 'components/ui/IconButton';

import PopoverTrigger from './PopoverTrigger';

export interface PopoverQuestionTriggerIconButtonProps extends Omit<IconButtonProps, 'asChild' | 'children'> {}

const PopoverQuestionTriggerIconButton = forwardRef<
  HTMLButtonElement,
  PopoverQuestionTriggerIconButtonProps
>((props, ref) => {
  return (
    <PopoverTrigger asChild>
      <IconButton {...props} ref={ref}>
        <PopoverTrigger.QuestionIcon />
      </IconButton>
    </PopoverTrigger>
  );
});
PopoverQuestionTriggerIconButton.displayName = 'PopoverQuestionTriggerIconButton';

export default PopoverQuestionTriggerIconButton;
