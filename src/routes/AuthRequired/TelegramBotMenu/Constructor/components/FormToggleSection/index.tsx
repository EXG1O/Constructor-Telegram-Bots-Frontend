import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import TriggerButton from './components/TriggerButton';
import FormToggleSectionContext from './contexts/FormToggleSectionContext';

export interface FormToggleSectionProps extends Omit<CollapsibleProps, 'open'> {
  name: string;
  advanced?: boolean;
  getOpen?: (value: any) => boolean;
}

function FormToggleSection({
  advanced,
  children,
  getOpen,
  ...props
}: FormToggleSectionProps): ReactElement {
  const [{ value }, _meta, { setValue: setOpen }] = useField<any>(props);
  const open: boolean = getOpen ? getOpen(value) : Boolean(value);

  return (
    <Collapsible {...props} open={open} onOpenChange={advanced ? setOpen : undefined}>
      {advanced ? (
        <FormToggleSectionContext.Provider value={{ open }}>
          {children}
        </FormToggleSectionContext.Provider>
      ) : (
        <Collapsible.Body>{children}</Collapsible.Body>
      )}
    </Collapsible>
  );
}

export default Object.assign(FormToggleSection, {
  TriggerButton,
  Body: Collapsible.Body,
});
