import React, { forwardRef } from 'react';
import { FastField, FastFieldProps, FormikProps } from 'formik';

import SelectFeedback, {
  SelectFeedbackProps,
  selectFeedbackVariants,
} from 'components/shared/SelectFeedback';

export { selectFeedbackVariants as formSelectFeedbackVariants };

export interface FormSelectFeedbackProps
  extends Omit<
    SelectFeedbackProps,
    'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'error'
  > {
  name: string;
}

const FormSelectFeedback = forwardRef<HTMLSelectElement, FormSelectFeedbackProps>(
  ({ name, onChange, ...props }, ref) => {
    function handleChange(
      form: FormikProps<any>,
      event: React.ChangeEvent<HTMLSelectElement>,
    ): void {
      form.setFieldValue(name, event.target.value);
      onChange?.(event);
    }

    return (
      <FastField name={name}>
        {({ field, meta, form }: FastFieldProps) => (
          <SelectFeedback
            {...props}
            ref={ref}
            value={field.value}
            error={meta.error}
            onChange={(event) => handleChange(form, event)}
          />
        )}
      </FastField>
    );
  },
);
FormSelectFeedback.displayName = 'FormSelectFeedback';

export default FormSelectFeedback;
