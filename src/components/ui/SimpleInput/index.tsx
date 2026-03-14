import React, { type ReactElement, type ReactNode } from 'react';

import SimpleInputContainer from './components/SimpleInputContainer';
import SimpleInputEditor from './components/SimpleInputEditor';
import SimpleInputToolbar from './components/SimpleInputToolbar';

import { SimpleInputStoreProvider, type StoreProps } from './store';

export type Size = 'sm' | 'md' | 'lg';

export interface SimpleInputProps extends StoreProps {
  children?: ReactNode;
}

export const DEFAULT_SIZE: Size = 'md';

function SimpleInput({ children, ...storeProps }: SimpleInputProps): ReactElement {
  return (
    <SimpleInputStoreProvider storeProps={storeProps}>
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
