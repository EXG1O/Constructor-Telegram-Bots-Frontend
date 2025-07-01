import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Collapsible, { CollapsibleProps } from 'components/ui/Collapsible';

import { Type } from '../../../../KeyboardTypes';

import cn from 'utils/cn';

export interface ToggleSectionProps extends Omit<CollapsibleProps, 'open'> {}

function ToggleSection({
  className,
  children,
  ...props
}: ToggleSectionProps): ReactElement {
  const [{ value: type }] = useField<Type>(`keyboard.type`);

  return (
    <Collapsible
      {...props}
      open={type !== 'default'}
      className={cn('w-full', className)}
    >
      <Collapsible.Body>{children}</Collapsible.Body>
    </Collapsible>
  );
}

export default ToggleSection;
