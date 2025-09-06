import React, { ReactElement } from 'react';

import SimpleInputContainer from './components/SimpleInputContainer';
import SimpleInputEditor from './components/SimpleInputEditor';
import SimpleInputToolbar from './components/SimpleInputToolbar';
import SimpleInputStoreProvider, {
  SimpleInputStoreProviderProps,
} from './providers/SimpleInputStoreProvider';

export type Size = 'sm' | 'md' | 'lg';

export interface SimpleInputProps extends SimpleInputStoreProviderProps {}

export const DEFAULT_SIZE: Size = 'md';

function SimpleInput({ children, ...props }: SimpleInputProps): ReactElement {
  return (
    <SimpleInputStoreProvider {...props}>
      {children || (
        <SimpleInputContainer>
          <SimpleInputEditor />
        </SimpleInputContainer>
      )}
    </SimpleInputStoreProvider>
  );
}

export default Object.assign(SimpleInput, {
  Container: SimpleInputContainer,
  Toolbar: SimpleInputToolbar,
  Editor: SimpleInputEditor,
});
