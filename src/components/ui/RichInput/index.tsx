import React, { ReactElement } from 'react';

import RichInputContainer from './components/RichInputContainer';
import RichInputEditor from './components/RichInputEditor';
import RichInputToolbar from './components/RichInputToolbar';
import RichInputStoreProvider, {
  RichInputStoreProviderProps,
} from './providers/RichInputStoreProvider';

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

export interface RichInputProps extends Omit<RichInputStoreProviderProps, 'children'> {}

function RichInput({
  formats = DEFAULT_FORMATS,
  ...props
}: RichInputProps): ReactElement {
  return (
    <RichInputStoreProvider {...props} formats={formats}>
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
    </RichInputStoreProvider>
  );
}

export default Object.assign(RichInput, {
  StoreProvider: RichInputStoreProvider,
  Container: RichInputContainer,
  Toolbar: RichInputToolbar,
  Editor: RichInputEditor,
});
