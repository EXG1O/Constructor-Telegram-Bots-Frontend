import React, { forwardRef } from 'react';
import { FastField, FastFieldProps, FormikProps } from 'formik';

import CheckFeedback, {
  CheckFeedbackProps,
  checkFeedbackVariants,
} from 'components/shared/CheckFeedback';

export { checkFeedbackVariants as formCheckFeedbackVariants };

export interface FormCheckFeedbackProps
  extends Omit<
    CheckFeedbackProps,
    'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'error'
  > {
  name: string;
}

const FormCheckFeedback = forwardRef<HTMLInputElement, FormCheckFeedbackProps>(
  ({ name, onChange, ...props }, ref) => {
    function handleChange(
      form: FormikProps<any>,
      event: React.ChangeEvent<HTMLInputElement>,
    ): void {
      form.setFieldValue(name, event.target.checked);
      onChange?.(event);
    }

    return (
      <FastField name={name}>
        {({ field, meta, form }: FastFieldProps) => (
          <CheckFeedback
            {...props}
            ref={ref}
            checked={field.checked}
            error={meta.error}
            onChange={(event) => handleChange(form, event)}
          />
        )}
      </FastField>
    );
  },
);
FormCheckFeedback.displayName = 'FormCheckFeedback';

export default FormCheckFeedback;
