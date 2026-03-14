import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import SimpleInputFeedback, {
  type SimpleInputFeedbackProps,
} from 'components/shared/SimpleInputFeedback';

import composeHandlers from 'utils/composeHandlers';

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
  return (
    <FastField name={name}>
      {({ field, meta, form }: FastFieldProps) => (
        <SimpleInputFeedback
          {...props}
          value={field.value}
          error={meta.error}
          onChange={composeHandlers(
            (value) => form.setFieldValue(name, value),
            onChange,
          )}
        />
      )}
    </FastField>
  );
}

export default FormSimpleInputFeedback;
