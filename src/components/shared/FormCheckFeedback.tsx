import React, { forwardRef } from 'react';
import { useField } from 'formik';

import CheckFeedback, {
  CheckFeedbackProps,
  checkFeedbackVariants,
} from 'components/shared/CheckFeedback';

export { checkFeedbackVariants as formCheckFeedbackVariants };

export interface FormCheckFeedbackProps extends Omit<CheckFeedbackProps, 'error'> {
  name: string;
}

const FormCheckFeedback = forwardRef<HTMLInputElement, FormCheckFeedbackProps>(
  (props, ref) => {
    const [field, meta] = useField<(typeof props)['value']>({
      ...props,
      type: 'checkbox',
    });

    return <CheckFeedback {...props} {...field} ref={ref} error={meta.error} />;
  },
);
FormCheckFeedback.displayName = 'FormCheckFeedback';

export default FormCheckFeedback;
