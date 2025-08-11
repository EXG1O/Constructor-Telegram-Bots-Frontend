import React, { forwardRef } from 'react';
import { Variable } from 'lucide-react';
import type { Selection } from 'monaco-editor';

import TelegramBotVariablesPopover from 'components/shared/TelegramBotVariablesPopover';
import ToolbarButton, {
  ToolbarButtonProps,
} from 'components/ui/CodeInput/components/CodeInputToolbar/components/ToolbarButton';

import useCodeInputStore from 'components/ui/CodeInput/hooks/useCodeInputStore';

export interface ToolbarVariablesButtonProps
  extends Omit<ToolbarButtonProps, 'children'> {}

const ToolbarVariablesButton = forwardRef<
  HTMLButtonElement,
  ToolbarVariablesButtonProps
>((props, ref) => {
  const editor = useCodeInputStore((state) => state.editor);

  function handleSelect(variable: string): void {
    if (!editor) return;

    const selections: Selection[] | null = editor.getSelections();
    if (!selections?.length) return;

    const text: string = `{{ ${variable} }}`;

    editor.executeEdits(
      'insert-variable',
      selections.map((selection) => ({
        range: selection,
        text,
        forceMoveMarkers: true,
      })),
    );
  }

  return (
    <TelegramBotVariablesPopover onSelect={handleSelect}>
      <TelegramBotVariablesPopover.Trigger asChild>
        <ToolbarButton {...props} ref={ref}>
          <Variable />
        </ToolbarButton>
      </TelegramBotVariablesPopover.Trigger>
    </TelegramBotVariablesPopover>
  );
});
ToolbarVariablesButton.displayName = 'ToolbarVariablesButton';

export default ToolbarVariablesButton;
