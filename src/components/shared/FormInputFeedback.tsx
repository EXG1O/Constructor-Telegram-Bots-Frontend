import React, { forwardRef } from 'react';
import { useField } from 'formik';

import InputFeedback, {
  InputFeedbackProps,
  inputFeedbackVariants,
} from 'components/shared/InputFeedback';

export { inputFeedbackVariants as formInputFeedbackVariants };

export interface FormInputFeedbackProps extends Omit<InputFeedbackProps, 'error'> {
  name: string;
}

const FormInputFeedback = forwardRef<HTMLInputElement, FormInputFeedbackProps>(
  ({ size, ...props }, ref) => {
    const [field, meta] = useField<(typeof props)['value']>(props);

    return (
      <InputFeedback ref={ref} {...props} {...field} size={size} error={meta.error} />
    );
  },
);
FormInputFeedback.displayName = 'FormInputFeedback';

export default FormInputFeedback;
