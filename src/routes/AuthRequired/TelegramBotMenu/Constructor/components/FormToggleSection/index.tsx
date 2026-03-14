import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import Collapsible from 'components/ui/Collapsible';

import Inner, { type InnerProps } from './components/Inner';
import TriggerButton from './components/TriggerButton';

import { FormToggleSectionStoreProvider, type StoreProps } from './store';

export interface FormToggleSectionProps
  extends StoreProps, Omit<InnerProps, keyof FastFieldProps> {
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
        <FormToggleSectionStoreProvider storeProps={{ getOpen }}>
          <Inner {...props} {...fieldProps} />
        </FormToggleSectionStoreProvider>
      )}
    </FastField>
  );
}

export default Object.assign(FormToggleSection, {
  TriggerButton,
  Body: Collapsible.Body,
});
