import React, { type ReactElement, type ReactNode } from 'react';

import RichInputContainer from './components/RichInputContainer';
import RichInputEditor from './components/RichInputEditor';
import RichInputInner from './components/RichInputInner';
import RichInputToolbar from './components/RichInputToolbar';

import { RichInputStoreProvider, type StateProps } from './store';

export type Size = 'sm' | 'md' | 'lg';

export interface RichInputProps extends StateProps {
  children?: ReactNode;
}

export const DEFAULT_SIZE: Size = 'md';
export const DEFAULT_FORMATS: string[] = [
  'bold',
  'italic',
  'underline',
  'strike',
  'link',
  'code',
  'code-block',
  'blockquote',
];

function RichInput({ children, ...stateProps }: RichInputProps): ReactElement {
  return (
    <RichInputStoreProvider stateProps={stateProps}>
      <RichInputInner>
        {children || (
          <RichInputContainer>
            <RichInputToolbar>
              <RichInputToolbar.Group>
                <RichInputToolbar.Button format='bold' />
                <RichInputToolbar.Button format='italic' />
                <RichInputToolbar.Button format='underline' />
                <RichInputToolbar.Button format='strike' />
                <RichInputToolbar.LinkButton />
                <RichInputToolbar.Button format='code' />
                <RichInputToolbar.Button format='code-block' />
                <RichInputToolbar.Button format='blockquote' />
                <RichInputToolbar.Button format='clean' />
              </RichInputToolbar.Group>
            </RichInputToolbar>
            <RichInputEditor />
          </RichInputContainer>
        )}
      </RichInputInner>
    </RichInputStoreProvider>
  );
}

export default Object.assign(RichInput, {
  Container: RichInputContainer,
  Toolbar: RichInputToolbar,
  Editor: RichInputEditor,
});
