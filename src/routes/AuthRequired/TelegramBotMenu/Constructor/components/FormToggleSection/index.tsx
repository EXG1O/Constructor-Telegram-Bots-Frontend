import React, { ReactElement } from 'react';
import { FastField, FastFieldProps, FormikProps } from 'formik';

import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import TriggerButton from './components/TriggerButton';
import FormToggleSectionContext from './contexts/FormToggleSectionContext';

export interface FormToggleSectionProps extends Omit<CollapsibleProps, 'open'> {
  name: string;
  advanced?: boolean;
  getOpen?: (value: any) => boolean;
}

function FormToggleSection({
  name,
  advanced,
  children,
  getOpen,
  onOpenChange,
  ...props
}: FormToggleSectionProps): ReactElement {
  function handleOpenChange(form: FormikProps<any>, value: boolean): void {
    if (!advanced) return;
    form.setFieldValue(name, value);
    onOpenChange?.(value);
  }

  return (
    <FastField name={name}>
      {({ field, form }: FastFieldProps) => {
        const open: boolean = getOpen ? getOpen(field.value) : Boolean(field.value);

        return (
          <Collapsible
            {...props}
            open={open}
            onOpenChange={(value) => handleOpenChange(form, value)}
          >
            {advanced ? (
              <FormToggleSectionContext.Provider value={{ open }}>
                {children}
              </FormToggleSectionContext.Provider>
            ) : (
              <Collapsible.Body>{children}</Collapsible.Body>
            )}
          </Collapsible>
        );
      }}
    </FastField>
  );
}

export default Object.assign(FormToggleSection, {
  TriggerButton,
  Body: Collapsible.Body,
});
