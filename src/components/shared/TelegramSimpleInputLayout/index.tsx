import React, { lazy, ReactElement, Suspense } from 'react';

import SimpleInput from 'components/ui/SimpleInput';
import Spinner from 'components/ui/Spinner';

const ToolbarVariablesButton = lazy(
  () => import('./components/ToolbarVariablesButton'),
);

export interface TelegramSimpleInputLayoutProps {
  toolbarVariables?: boolean;
}

function TelegramSimpleInputLayout({
  toolbarVariables,
}: TelegramSimpleInputLayoutProps): ReactElement {
  return (
    <SimpleInput.Container>
      {toolbarVariables && (
        <SimpleInput.Toolbar className='justify-end'>
          <Suspense fallback={<Spinner size='3xs' />}>
            <ToolbarVariablesButton />
          </Suspense>
        </SimpleInput.Toolbar>
      )}
      <SimpleInput.Editor />
    </SimpleInput.Container>
  );
}

export default TelegramSimpleInputLayout;
