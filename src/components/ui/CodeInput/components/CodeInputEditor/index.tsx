import React, { forwardRef, HTMLAttributes, useCallback, useMemo } from 'react';
import MonacoEditor, { OnChange, OnMount } from '@monaco-editor/react';
import { loader } from '@monaco-editor/react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import * as monacoCore from 'monaco-editor';

import Loading from './components/Loading';

import settings from 'settings';

import useCodeInputStore from '../../hooks/useCodeInputStore';

import cn from 'utils/cn';

import { DEFAULT_SIZE, Size } from '../..';
import { Editor } from '../..';

const PrimitiveEditor = MonacoEditor;
PrimitiveEditor.displayName = 'PrimitiveEditor';

if (!settings.WEBPACK_SERVE) {
  loader.config({ monaco: monacoCore });
}

export const codeInputEditorVariants = cva(['w-full'], {
  variants: {
    size: {
      sm: ['px-2', 'py-1'],
      md: ['px-3', 'py-1.5'],
      lg: ['px-4', 'py-2'],
    },
  },
  defaultVariants: {
    size: DEFAULT_SIZE,
  },
});

export interface CodeInputEditorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  asChild?: boolean;
}

const DEFAULT_OPTIONS: monacoCore.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  glyphMargin: false,
  folding: false,
  renderLineHighlight: 'none',
  lineNumbers: 'off',
  lineNumbersMinChars: 0,
  lineDecorationsWidth: 0,
  overviewRulerLanes: 0,
  scrollBeyondLastLine: false,
  scrollbar: { vertical: 'hidden' },
  inlayHints: { enabled: 'off' },
  contextmenu: false,
};

const LINE_HEIGHT_MAP: Record<Size, number> = { sm: 19, md: 22, lg: 22 };
const FONT_SIZE_MAP: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

const CodeInputEditor = forwardRef<HTMLDivElement, CodeInputEditorProps>(
  ({ asChild, className, ...props }, ref) => {
    const editor = useCodeInputStore((state) => state.editor);
    const size = useCodeInputStore((state) => state.size);
    const value = useCodeInputStore((state) => state.value);
    const language = useCodeInputStore((state) => state.language);
    const saveViewState = useCodeInputStore((state) => state.saveViewState);
    const keepCurrentModel = useCodeInputStore((state) => state.keepCurrentModel);
    const extraOptions = useCodeInputStore((state) => state.options);
    const beforeMount = useCodeInputStore((state) => state.beforeMount);
    const onMount = useCodeInputStore((state) => state.onMount);
    const onChange = useCodeInputStore((state) => state.onChange);
    const onValidate = useCodeInputStore((state) => state.onValidate);
    const setEditor = useCodeInputStore((state) => state.setEditor);

    const lineHeight: number = LINE_HEIGHT_MAP[size];
    const fontSize: number = FONT_SIZE_MAP[size];

    const options = useMemo<monacoCore.editor.IStandaloneEditorConstructionOptions>(
      () => ({ ...DEFAULT_OPTIONS, fontSize, ...extraOptions }),
      [fontSize, extraOptions],
    );

    const handleChange = useCallback<OnChange>(
      (value) => {
        if (!editor || value === undefined) return;

        editor.updateLayout();
        onChange?.(editor, value);
      },
      [editor, onChange],
    );

    const handleMount = useCallback<OnMount>(
      (monacoEditor, monaco) => {
        const editor: Editor = Object.assign(monacoEditor, {
          updateLayout(this: typeof monacoEditor, resetWidth?: boolean): void {
            const editorModel: monacoCore.editor.ITextModel | null = this.getModel();
            if (editorModel === null) return;

            this.layout({
              width: resetWidth
                ? 0
                : this.getContainerDomNode().querySelector('.monaco-editor')!
                    .clientWidth,
              height: editorModel.getLineCount() * lineHeight,
            });
          },
        });

        editor.updateLayout();
        setEditor(editor);
        onMount?.(editor, monaco);
      },
      [onMount],
    );

    const Component = asChild ? Slot : 'div';

    return (
      <Component
        {...props}
        ref={ref}
        className={cn(codeInputEditorVariants({ size, className }))}
      >
        <MonacoEditor
          value={value}
          language={language}
          loading={<Loading />}
          saveViewState={saveViewState}
          keepCurrentModel={keepCurrentModel}
          options={options}
          beforeMount={beforeMount}
          onChange={handleChange}
          onMount={handleMount}
          onValidate={onValidate}
        />
      </Component>
    );
  },
);
CodeInputEditor.displayName = 'CodeInputEditor';

export default CodeInputEditor;
