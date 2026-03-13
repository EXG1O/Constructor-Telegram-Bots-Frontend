import React, { type ReactElement, type ReactNode } from 'react';
import type { editor } from 'monaco-editor';

import CodeInputContainer from './components/CodeInputContainer';
import CodeInputEditor from './components/CodeInputEditor';
import CodeInputToolbar from './components/CodeInputToolbar';

import { CodeInputStoreProvider, type StoreProps } from './store';

export type Size = 'sm' | 'md' | 'lg';

export interface Editor extends editor.IStandaloneCodeEditor {
  updateLayout: (shouldResetWidth?: boolean) => void;
}

export interface CodeInputProps extends StoreProps {
  children?: ReactNode;
}

export const DEFAULT_SIZE: Size = 'md';

function CodeInput({ children, ...storeProps }: CodeInputProps): ReactElement {
  return (
    <CodeInputStoreProvider storeProps={storeProps}>
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
