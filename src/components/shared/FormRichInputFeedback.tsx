import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps, type FormikProps } from 'formik';

import RichInputFeedback, {
  type RichInputFeedbackProps,
} from 'components/shared/RichInputFeedback';

export interface FormRichInputFeedbackProps extends Omit<
  RichInputFeedbackProps,
  'value' | 'error'
> {
  name: string;
}

function FormRichInputFeedback({
  name,
  onChange,
  ...props
}: FormRichInputFeedbackProps): ReactElement {
  function handleChange(form: FormikProps<any>, value: string): void {
    form.setFieldValue(name, value);
    onChange?.(value);
  }

  return (
    <FastField name={name}>
      {({ field, meta, form }: FastFieldProps) => (
        <RichInputFeedback
          {...props}
          value={field.value}
          error={meta.error}
          onChange={(value) => handleChange(form, value)}
        />
      )}
    </FastField>
  );
}

export default FormRichInputFeedback;
