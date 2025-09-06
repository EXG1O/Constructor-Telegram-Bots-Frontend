import React, { ReactElement } from 'react';
import { useField } from 'formik';

import SimpleInputFeedback, {
  SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';

export interface FormSimpleInputFeedbackProps
  extends Omit<SimpleInputFeedbackProps, 'value' | 'error'> {
  name: string;
}

function FormSimpleInputFeedback({
  name,
  onChange,
  ...props
}: FormSimpleInputFeedbackProps): ReactElement {
  const [field, meta, { setValue }] = useField(name);

  function handleChange(value: string): void {
    setValue(value);
    onChange?.(value);
  }

  return (
    <SimpleInputFeedback
      {...props}
      value={field.value}
      error={meta.error}
      onChange={handleChange}
    />
  );
}

export default FormSimpleInputFeedback;
