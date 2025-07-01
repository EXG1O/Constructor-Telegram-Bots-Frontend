import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

export interface FormToggleSectionProps extends Omit<CollapsibleProps, 'open'> {
  name: string;
}

function FormToggleSection({
  children,
  ...props
}: FormToggleSectionProps): ReactElement {
  const [{ value: open }] = useField<boolean>(props);

  return (
    <Collapsible {...props} open={open}>
      <Collapsible.Body>{children}</Collapsible.Body>
    </Collapsible>
  );
}

export default FormToggleSection;
