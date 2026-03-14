import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import RichInputFeedback, {
  type RichInputFeedbackProps,
} from 'components/shared/RichInputFeedback';

import composeHandlers from 'utils/composeHandlers';

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
  return (
    <FastField name={name}>
      {({ field, meta, form }: FastFieldProps) => (
        <RichInputFeedback
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

export default FormRichInputFeedback;
