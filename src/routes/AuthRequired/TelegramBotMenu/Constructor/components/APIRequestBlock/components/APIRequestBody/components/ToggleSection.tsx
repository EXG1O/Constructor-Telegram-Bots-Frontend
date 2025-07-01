import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import { Method } from '../../APIRequestMethods';

import cn from 'utils/cn';

export interface ToggleSectionProps extends Omit<CollapsibleProps, 'open'> {}

function ToggleSection({
  children,
  className,
  ...props
}: ToggleSectionProps): ReactElement {
  const [{ value: method }] = useField<Method>('api_request.method');
  const open: boolean = method !== 'get';

  return (
    <Collapsible {...props} open={open} className={cn('w-full', className)}>
      <Collapsible.Body>{children}</Collapsible.Body>
    </Collapsible>
  );
}

export default ToggleSection;
