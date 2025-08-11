import React, { lazy, ReactElement, Suspense } from 'react';

import CodeInput from 'components/ui/CodeInput';
import Spinner from 'components/ui/Spinner';

const ToolbarVariablesButton = lazy(
  () => import('./components/ToolbarVariablesButton'),
);

export interface TelegramCodeInputLayoutProps {
  toolbarVariables?: boolean;
}

function TelegramCodeInputLayout({
  toolbarVariables,
}: TelegramCodeInputLayoutProps): ReactElement {
  return (
    <CodeInput.Container>
      {toolbarVariables && (
        <CodeInput.Toolbar className='justify-end'>
          <Suspense fallback={<Spinner size='3xs' />}>
            <ToolbarVariablesButton />
          </Suspense>
        </CodeInput.Toolbar>
      )}
      <CodeInput.Editor />
    </CodeInput.Container>
  );
}

export default TelegramCodeInputLayout;
