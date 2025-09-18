import React, { ReactElement } from 'react';
import { FastField, FastFieldProps, FormikProps } from 'formik';

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
