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

export const monacoEditorVariants = cva(
  [
    'flex',
    'flex-col',
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

export interface MonacoEditorProps
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
    VariantProps<typeof monacoEditorVariants> {
  onMount?: (editor: Editor, monaco: Monaco) => void;
  onChange?: (editor: Editor, value: string) => void;
}

type Size = NonNullable<MonacoEditorProps['size']>;

const lineHeightMap: Record<Size, number> = { sm: 19, md: 22, lg: 22 };
const fontSizeMap: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

const baseOptions: monacoCore.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  renderLineHighlight: 'none',
  lineNumbersMinChars: 3,
  overviewRulerLanes: 0,
  scrollBeyondLastLine: false,
  scrollbar: { vertical: 'hidden' },
  inlayHints: { enabled: 'off' },
  contextmenu: false,
};

function MonacoEditor({
  defaultValue,
  defaultLanguage,
  value,
  language,
  line,
  saveViewState,
  keepCurrentModel,
  size,
  invalid,
  options: extraOptions,
  className,
  beforeMount,
  onMount,
  onChange,
  onValidate,
  ...props
}: MonacoEditorProps): ReactElement {
  size ??= 'md';

  const editor = useRef<Editor | undefined>(undefined);

  const lineHeight: number = lineHeightMap[size];
  const fontSize: number = fontSizeMap[size];

  const options = useMemo<monacoCore.editor.IStandaloneEditorConstructionOptions>(
    () => ({ ...baseOptions, fontSize, ...extraOptions }),
    [extraOptions],
  );

  const updateLayout = useCallback((resetWidth?: boolean) => {
    if (!editor.current) return;

    const editorModel: monacoCore.editor.ITextModel | null = editor.current.getModel();

    if (editorModel === null) return;

    editor.current.layout({
      width: resetWidth
        ? 0
        : editor.current.getContainerDomNode().querySelector('.monaco-editor')!
            .clientWidth,
      height: editorModel.getLineCount() * lineHeight,
    });
  }, []);

  const handleChange = useCallback<OnChange>(
    (value) => {
      if (!editor.current || value === undefined) return;

      updateLayout();
      onChange?.(editor.current, value);
    },
    [onChange],
  );

  const handleMount = useCallback<OnMount>(
    (baseEditor, monaco) => {
      editor.current = Object.assign(baseEditor, { updateLayout });

      updateLayout();
      onMount?.(editor.current, monaco);
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
        className: cn(monacoEditorVariants({ size, invalid, className })),
      }}
      beforeMount={beforeMount}
      onChange={handleChange}
      onMount={handleMount}
      onValidate={onValidate}
    />
  );
}

export default MonacoEditor;
