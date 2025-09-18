import React, { ReactElement } from 'react';
import { FastField, FastFieldProps, FormikProps } from 'formik';

import CodeInputFeedback, {
  CodeInputFeedbackProps,
} from 'components/shared/CodeInputFeedback';
import { Editor } from 'components/ui/CodeInput';

export interface FormCodeInputFeedbackProps
  extends Omit<CodeInputFeedbackProps, 'value' | 'error'> {
  name: string;
}

function FormCodeInputFeedback({
  name,
  onChange,
  ...props
}: FormCodeInputFeedbackProps): ReactElement {
  function handleChange(form: FormikProps<any>, editor: Editor, value: string): void {
    form.setFieldValue(name, value);
    onChange?.(editor, value);
  }

  return (
    <FastField name={name}>
      {({ field, meta, form }: FastFieldProps) => (
        <CodeInputFeedback
          {...props}
          value={field.value}
          error={meta.error}
          onChange={(editor, value) => handleChange(form, editor, value)}
        />
      )}
    </FastField>
  );
}

export default FormCodeInputFeedback;
