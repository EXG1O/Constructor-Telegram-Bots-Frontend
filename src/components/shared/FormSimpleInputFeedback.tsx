import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps, type FormikProps } from 'formik';

import SimpleInputFeedback, {
  type SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';

export interface FormSimpleInputFeedbackProps extends Omit<
  SimpleInputFeedbackProps,
  'value' | 'error'
> {
  name: string;
}

function FormSimpleInputFeedback({
  name,
  onChange,
  ...props
}: FormSimpleInputFeedbackProps): ReactElement {
  function handleChange(form: FormikProps<any>, value: string): void {
    form.setFieldValue(name, value);
    onChange?.(value);
  }

  return (
    <FastField name={name}>
      {({ field, meta, form }: FastFieldProps) => (
        <SimpleInputFeedback
          {...props}
          value={field.value}
          error={meta.error}
          onChange={(value) => handleChange(form, value)}
        />
      )}
    </FastField>
  );
}

export default FormSimpleInputFeedback;
