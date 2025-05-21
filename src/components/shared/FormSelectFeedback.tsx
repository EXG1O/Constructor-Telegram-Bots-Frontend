import React, { forwardRef } from 'react';
import { useField } from 'formik';

import SelectFeedback, {
  SelectFeedbackProps,
  selectFeedbackVariants,
} from 'components/shared/SelectFeedback';

export { selectFeedbackVariants as formSelectFeedbackVariants };

export interface FormSelectFeedbackProps extends Omit<SelectFeedbackProps, 'error'> {
  name: string;
}

const FormSelectFeedback = forwardRef<HTMLSelectElement, FormSelectFeedbackProps>(
  ({ size, ...props }, ref) => {
    const [field, meta] = useField<(typeof props)['value']>(props);

    return (
      <SelectFeedback {...props} {...field} ref={ref} size={size} error={meta.error} />
    );
  },
);
FormSelectFeedback.displayName = 'FormSelectFeedback';

export default FormSelectFeedback;
