import React, { forwardRef } from 'react';

import TelegramBotVariablesPopover from 'components/shared/TelegramBotVariablesPopover';
import ToolbarButton, {
  ToolbarButtonProps,
} from 'components/ui/SimpleInput/components/SimpleInputToolbar/components/ToolbarButton';

import useSimpleInputStore from 'components/ui/SimpleInput/hooks/useSimpleInputStore';

export interface ToolbarVariablesButtonProps
  extends Omit<ToolbarButtonProps, 'children'> {}

const ToolbarVariablesButton = forwardRef<
  HTMLButtonElement,
  ToolbarVariablesButtonProps
>((props, ref) => {
  const store = useSimpleInputStore();

  function handleSelect(variable: string): void {
    const { value, onChange } = store.getState();
    onChange?.(value + `{{ ${variable} }}`);
  }

  return (
    <TelegramBotVariablesPopover onSelect={handleSelect}>
      <TelegramBotVariablesPopover.Trigger asChild>
        <ToolbarButton {...props} ref={ref}>
          <TelegramBotVariablesPopover.Trigger.Icon />
        </ToolbarButton>
      </TelegramBotVariablesPopover.Trigger>
    </TelegramBotVariablesPopover>
  );
});
ToolbarVariablesButton.displayName = 'ToolbarVariablesButton';

export default ToolbarVariablesButton;
