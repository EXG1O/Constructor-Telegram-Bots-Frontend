import React, { ReactElement } from 'react';
import { useField } from 'formik';
import { Delta } from 'quill';

import RichInputFeedback, {
  RichInputFeedbackProps,
} from 'components/shared/RichInputFeedback';

export interface FormRichInputFeedbackProps
  extends Omit<RichInputFeedbackProps, 'error'> {
  name: string;
}

function FormRichInputFeedback({
  name,
  onChange,
  ...props
}: FormRichInputFeedbackProps): ReactElement {
  const [field, meta, { setValue }] = useField<(typeof props)['value']>(name);

  function handleChange(value: Delta): void {
    setValue(value);
    onChange?.(value);
  }

  return (
    <RichInputFeedback
      {...props}
      value={field.value}
      error={meta.error}
      onChange={handleChange}
    />
  );
}

export default FormRichInputFeedback;
