import React, { ReactElement } from 'react';
import { useField } from 'formik';

import MonacoEditorFeedback, {
  MonacoEditorFeedbackProps,
} from 'components/shared/MonacoEditorFeedback';
import { Editor } from 'components/ui/MonacoEditor';

export interface FormMonacoEditorFeedbackProps
  extends Omit<MonacoEditorFeedbackProps, 'error'> {
  name: string;
}

function FormMonacoEditorFeedback({
  name,
  onChange,
  ...props
}: FormMonacoEditorFeedbackProps): ReactElement {
  const [field, meta, { setValue }] = useField<(typeof props)['value']>(name);

  function handleChange(editor: Editor, value: string): void {
    setValue(value);
    onChange?.(editor, value);
  }

  return (
    <MonacoEditorFeedback
      {...props}
      value={field.value}
      error={meta.error}
      onChange={handleChange}
    />
  );
}

export default FormMonacoEditorFeedback;
