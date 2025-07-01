import React, { ReactElement } from 'react';
import { useField } from 'formik';

import CodeInputFeedback, {
  CodeInputFeedbackProps,
  codeInputFeedbackVariants,
} from 'components/shared/CodeInputFeedback';
import { Editor } from 'components/ui/CodeInput';

export { codeInputFeedbackVariants as formCodeInputFeedbackVariants };

export interface FormCodeInputFeedbackProps
  extends Omit<CodeInputFeedbackProps, 'error'> {
  name: string;
}

function FormCodeInputFeedback({
  name,
  onChange,
  ...props
}: FormCodeInputFeedbackProps): ReactElement {
  const [field, meta, { setValue }] = useField<(typeof props)['value']>(name);

  function handleChange(editor: Editor, value: string): void {
    setValue(value);
    onChange?.(editor, value);
  }

  return (
    <CodeInputFeedback
      {...props}
      value={field.value}
      error={meta.error}
      onChange={handleChange}
    />
  );
}

export default FormCodeInputFeedback;
