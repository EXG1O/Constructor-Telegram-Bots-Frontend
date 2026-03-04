import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import Collapsible from 'components/ui/Collapsible';

import Inner, { type InnerProps } from './components/Inner';
import TriggerButton from './components/TriggerButton';
import StoreProvider, { type StoreProviderProps } from './providers/StoreProvider';

export interface FormToggleSectionProps
  extends Omit<StoreProviderProps, 'children'>, Omit<InnerProps, keyof FastFieldProps> {
  name: string;
}

function FormToggleSection({
  name,
  getOpen,
  ...props
}: FormToggleSectionProps): ReactElement {
  return (
    <FastField name={name}>
      {(fieldProps: FastFieldProps) => (
        <StoreProvider getOpen={getOpen}>
          <Inner {...props} {...fieldProps} />
        </StoreProvider>
      )}
    </FastField>
  );
}

export default Object.assign(FormToggleSection, {
  TriggerButton,
  Body: Collapsible.Body,
});
