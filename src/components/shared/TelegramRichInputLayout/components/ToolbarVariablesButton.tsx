import React, { forwardRef } from 'react';
import { Variable } from 'lucide-react';
import { Range } from 'quill';

import TelegramBotVariablesPopover from 'components/shared/TelegramBotVariablesPopover';
import ToolbarButton, {
  ToolbarButtonProps,
} from 'components/ui/RichInput/components/RichInputToolbar/components/ToolbarButton';

import useRichInputStore from 'components/ui/RichInput/hooks/useRichInputStore';

export interface ToolbarVariablesButtonProps
  extends Omit<ToolbarButtonProps, 'format'> {}

const ToolbarVariablesButton = forwardRef<
  HTMLButtonElement,
  ToolbarVariablesButtonProps
>((props, ref) => {
  const quill = useRichInputStore((state) => state.quill);

  function handleSelect(variable: string): void {
    if (!quill) return;
    const range: Range | null = quill.getSelection();
    quill.insertText(
      range ? range.index + range.length : quill.getLength() - 1,
      `{{ ${variable} }}`,
    );
  }

  return (
    <TelegramBotVariablesPopover onSelect={handleSelect}>
      <TelegramBotVariablesPopover.Trigger asChild>
        <ToolbarButton {...props} ref={ref} format='variables'>
          <Variable />
        </ToolbarButton>
      </TelegramBotVariablesPopover.Trigger>
    </TelegramBotVariablesPopover>
  );
});
ToolbarVariablesButton.displayName = 'ToolbarVariablesButton';

export default ToolbarVariablesButton;
