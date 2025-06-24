import React, {
  HTMLAttributes,
  ReactElement,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import Editor, {
  EditorProps,
  loader,
  Monaco,
  OnChange,
  OnMount,
} from '@monaco-editor/react';
import { cva, VariantProps } from 'class-variance-authority';
import * as monacoCore from 'monaco-editor';

import Spinner from 'components/ui/Spinner';

import settings from 'settings';

import cn from 'utils/cn';

if (!settings.WEBPACK_SERVE) {
  loader.config({ monaco: monacoCore });
}

export type Size = 'sm' | 'md' | 'lg';

export const DEFAULT_SIZE: Size = 'md';

export const codeInputVariants = cva(
  [
    'flex',
    'flex-col',
    'w-full',
    'bg-background',
    'text-foreground',
    'border',
    'transition',
    'focus-within:ring-4',
  ],
  {
    variants: {
      size: {
        sm: ['rounded-sm', 'px-2', 'py-1'],
        md: ['rounded-md', 'px-3', 'py-1.5'],
        lg: ['rounded-lg', 'px-4', 'py-2'],
      },
      invalid: {
        false: [
          'border-outline',
          'focus-within:border-outline-focus',
          'focus-within:ring-focus',
        ],
        true: ['border-danger', 'focus-within:ring-danger/25'],
      },
    },
    defaultVariants: {
      size: 'md',
      invalid: false,
    },
  },
);

export interface Editor extends monacoCore.editor.IStandaloneCodeEditor {
  updateLayout: (shouldResetWidth?: boolean) => void;
}

export interface CodeInputProps
  extends Pick<
      EditorProps,
      | 'defaultValue'
      | 'defaultLanguage'
      | 'value'
      | 'language'
      | 'line'
      | 'saveViewState'
      | 'keepCurrentModel'
      | 'options'
      | 'beforeMount'
      | 'onValidate'
    >,
    Omit<HTMLAttributes<HTMLElement>, 'defaultValue' | 'width' | 'height' | 'onChange'>,
    Omit<VariantProps<typeof codeInputVariants>, 'size'> {
  size?: Size;
  onMount?: (editor: Editor, monaco: Monaco) => void;
  onChange?: (editor: Editor, value: string) => void;
}

const LINE_HEIGHT_MAP: Record<Size, number> = { sm: 19, md: 22, lg: 22 };
const FONT_SIZE_MAP: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

export const DEFAULT_OPTIONS: monacoCore.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  renderLineHighlight: 'none',
  lineNumbersMinChars: 3,
  overviewRulerLanes: 0,
  scrollBeyondLastLine: false,
  scrollbar: { vertical: 'hidden' },
  inlayHints: { enabled: 'off' },
  contextmenu: false,
};

function CodeInput({
  defaultValue,
  defaultLanguage,
  value,
  language,
  line,
  saveViewState,
  keepCurrentModel,
  size = DEFAULT_SIZE,
  invalid,
  options: extraOptions,
  className,
  beforeMount,
  onMount,
  onChange,
  onValidate,
  ...props
}: CodeInputProps): ReactElement {
  const editorRef = useRef<Editor | null>(null);

  const lineHeight: number = LINE_HEIGHT_MAP[size];
  const fontSize: number = FONT_SIZE_MAP[size];

  const options = useMemo<monacoCore.editor.IStandaloneEditorConstructionOptions>(
    () => ({ ...DEFAULT_OPTIONS, fontSize, ...extraOptions }),
    [fontSize, extraOptions],
  );

  const updateLayout = useCallback((resetWidth?: boolean) => {
    const editor: Editor | null = editorRef.current;
    if (!editor) return;

    const editorModel: monacoCore.editor.ITextModel | null = editor.getModel();
    if (editorModel === null) return;

    editor.layout({
      width: resetWidth
        ? 0
        : editor.getContainerDomNode().querySelector('.monaco-editor')!.clientWidth,
      height: editorModel.getLineCount() * lineHeight,
    });
  }, []);

  const handleChange = useCallback<OnChange>(
    (value) => {
      const editor: Editor | null = editorRef.current;
      if (!editor || value === undefined) return;

      updateLayout();
      onChange?.(editor, value);
    },
    [onChange],
  );

  const handleMount = useCallback<OnMount>(
    (editor, monaco) => {
      editorRef.current = Object.assign(editor, { updateLayout });

      updateLayout();
      onMount?.(editorRef.current, monaco);
    },
    [onMount],
  );

  return (
    <Editor
      defaultValue={defaultValue}
      defaultLanguage={defaultLanguage}
      value={value}
      language={language}
      line={line}
      loading={<Spinner size='sm' className='self-center' />}
      saveViewState={saveViewState}
      keepCurrentModel={keepCurrentModel}
      options={options}
      wrapperProps={{
        ...props,
        className: cn(codeInputVariants({ size, invalid, className })),
      }}
      beforeMount={beforeMount}
      onChange={handleChange}
      onMount={handleMount}
      onValidate={onValidate}
    />
  );
}

export default CodeInput;
