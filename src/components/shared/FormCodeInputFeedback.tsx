import React, { type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import CodeInputFeedback, {
  type CodeInputFeedbackProps,
} from 'components/shared/CodeInputFeedback';

import composeHandlers from 'utils/composeHandlers';

export interface FormCodeInputFeedbackProps extends Omit<
  CodeInputFeedbackProps,
  'value' | 'error'
> {
  name: string;
}

function FormCodeInputFeedback({
  name,
  onChange,
  ...props
}: FormCodeInputFeedbackProps): ReactElement {
  return (
    <FastField name={name}>
      {({ field, meta, form }: FastFieldProps) => (
        <CodeInputFeedback
          {...props}
          value={field.value}
          error={meta.error}
          onChange={composeHandlers(
            (_editor, value) => form.setFieldValue(name, value),
            onChange,
          )}
        />
      )}
    </FastField>
  );
}

export default FormCodeInputFeedback;
