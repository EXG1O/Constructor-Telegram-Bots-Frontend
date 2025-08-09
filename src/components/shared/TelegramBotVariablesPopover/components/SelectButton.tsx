import React, { ReactElement } from 'react';
import { ArrowRight } from 'lucide-react';

import { ButtonProps } from 'components/ui/Button';
import IconButton from 'components/ui/IconButton';

import useTelegramBotVariablesPopover from '../hooks/useTelegramBotVariablesPopover';

export interface SelectButtonProps extends Omit<ButtonProps, 'size' | 'children'> {
  variable: string;
}

function SelectButton({
  variable,
  onClick,
  ...props
}: SelectButtonProps): ReactElement {
  const { onSelect } = useTelegramBotVariablesPopover();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>): void {
    onSelect(variable);
    onClick?.(event);
  }

  return (
    <IconButton {...props} size='sm' onClick={handleClick}>
      <ArrowRight />
    </IconButton>
  );
}

export default SelectButton;
