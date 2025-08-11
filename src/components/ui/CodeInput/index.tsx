import React, { ReactElement, ReactNode } from 'react';
import { editor } from 'monaco-editor';

import CodeInputContainer from './components/CodeInputContainer';
import CodeInputEditor from './components/CodeInputEditor';
import CodeInputToolbar from './components/CodeInputToolbar';
import CodeInputStoreProvider, {
  CodeInputStoreProviderProps,
} from './providers/CodeInputStoreProvider';

export type Size = 'sm' | 'md' | 'lg';

export interface Editor extends editor.IStandaloneCodeEditor {
  updateLayout: (shouldResetWidth?: boolean) => void;
}

export interface CodeInputProps extends Omit<CodeInputStoreProviderProps, 'children'> {
  children?: ReactNode;
}

export const DEFAULT_SIZE: Size = 'md';

function CodeInput({ children, ...props }: CodeInputProps): ReactElement {
  return (
    <CodeInputStoreProvider {...props}>
      {children || (
        <CodeInputContainer>
          <CodeInputEditor />
        </CodeInputContainer>
      )}
    </CodeInputStoreProvider>
  );
}

export default Object.assign(CodeInput, {
  Container: CodeInputContainer,
  Toolbar: CodeInputToolbar,
  Editor: CodeInputEditor,
});
