import React, { lazy, ReactElement, Suspense } from 'react';
import { cva } from 'class-variance-authority';
import Quill, { Parchment } from 'quill';

import RichInput, { DEFAULT_FORMATS } from 'components/ui/RichInput';
import Spinner from 'components/ui/Spinner';

import ToolbarSpoilerButton from './components/ToolbarSpoilerButton';

import useRichInputStore from 'components/ui/RichInput/hooks/useRichInputStore';

import cn from 'utils/cn';

const ToolbarVariablesButton = lazy(
  () => import('./components/ToolbarVariablesButton'),
);

const Inline = Quill.import('blots/inline') as typeof Parchment.InlineBlot;

class SpoilerBlot extends Inline {
  static blotName = 'spoiler';
  static tagName = 'tg-spoiler';
}

Quill.register(SpoilerBlot);

export const FORMATS: string[] = [...DEFAULT_FORMATS, 'spoiler'];

export const telegramRichInputEditorInnerContentVariants = cva(
  ['[&_tg-spoiler]:bg-secondary', '[&_tg-spoiler]:text-white'],
  {
    variants: {
      size: {
        sm: [
          '[&_tg-spoiler]:rounded-xs',
          '[&_tg-spoiler]:px-1',
          '[&_tg-spoiler]:py-0.5',
        ],
        md: [
          '[&_tg-spoiler]:rounded-sm',
          '[&_tg-spoiler]:px-1.5',
          '[&_tg-spoiler]:py-0.75',
        ],
        lg: ['[&_tg-spoiler]:rounded-md', '[&_tg-spoiler]:px-2', '[&_tg-spoiler]:py-1'],
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface TelegramRichInputLayoutProps {
  toolbarVariables?: boolean;
}

function TelegramRichInputLayout({
  toolbarVariables,
}: TelegramRichInputLayoutProps): ReactElement {
  const size = useRichInputStore((state) => state.size);

  return (
    <RichInput.Container>
      <RichInput.Toolbar className={cn(toolbarVariables && 'justify-between')}>
        <RichInput.Toolbar.Group>
          <RichInput.Toolbar.Button format='bold' />
          <RichInput.Toolbar.Button format='italic' />
          <RichInput.Toolbar.Button format='underline' />
          <RichInput.Toolbar.Button format='strike' />
          <RichInput.Toolbar.LinkButton />
          <RichInput.Toolbar.Button format='code' />
          <RichInput.Toolbar.Button format='code-block' />
          <RichInput.Toolbar.Button format='blockquote' />
          <ToolbarSpoilerButton />
          <RichInput.Toolbar.Button format='clean' />
        </RichInput.Toolbar.Group>
        {toolbarVariables && (
          <Suspense fallback={<Spinner size='3xs' />}>
            <ToolbarVariablesButton />
          </Suspense>
        )}
      </RichInput.Toolbar>
      <RichInput.Editor
        className={telegramRichInputEditorInnerContentVariants({ size })}
      />
    </RichInput.Container>
  );
}

export default TelegramRichInputLayout;
