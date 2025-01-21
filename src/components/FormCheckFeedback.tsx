import React, { forwardRef } from 'react';
import { useField } from 'formik';

import CheckFeedback, { CheckFeedbackProps } from './CheckFeedback';

import { FCA } from 'utils/helpers';

export interface FormCheckFeedbackProps extends CheckFeedbackProps {
  name: string;
}

const FormCheckFeedback: FCA<'input', FormCheckFeedbackProps> = forwardRef<
  HTMLElement,
  FormCheckFeedbackProps
>(function FormCheckFeedback({ size, type, ...props }, ref) {
  const [field, meta] = useField({
    type: type && type !== 'switch' ? type : 'checkbox',
    ...props,
  });

  return (
    <CheckFeedback
      ref={ref}
      {...props}
      {...field}
      size={size}
      type={type}
      error={meta.error}
    />
  );
});

export default FormCheckFeedback;
