import React, { forwardRef } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import CheckFeedback, {
  type CheckFeedbackProps,
  checkFeedbackVariants,
} from 'components/shared/CheckFeedback';

import composeHandlers from 'utils/composeHandlers';

export { checkFeedbackVariants as formCheckFeedbackVariants };

export interface FormCheckFeedbackProps extends Omit<
  CheckFeedbackProps,
  'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'error'
> {
  name: string;
}

const FormCheckFeedback = forwardRef<HTMLInputElement, FormCheckFeedbackProps>(
  ({ name, onChange, ...props }, ref) => {
    return (
      <FastField name={name} type='checkbox'>
        {({ field, meta, form }: FastFieldProps) => (
          <CheckFeedback
            {...props}
            ref={ref}
            checked={field.checked}
            error={meta.error}
            onChange={composeHandlers(
              (event) => form.setFieldValue(name, event.target.checked),
              onChange,
            )}
          />
        )}
      </FastField>
    );
  },
);
FormCheckFeedback.displayName = 'FormCheckFeedback';

export default FormCheckFeedback;
