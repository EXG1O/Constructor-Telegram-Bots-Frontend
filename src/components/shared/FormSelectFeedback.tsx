import React, { forwardRef } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import SelectFeedback, {
  type SelectFeedbackProps,
  selectFeedbackVariants,
} from 'components/shared/SelectFeedback';

import composeHandlers from 'utils/composeHandlers';

export { selectFeedbackVariants as formSelectFeedbackVariants };

export interface FormSelectFeedbackProps extends Omit<
  SelectFeedbackProps,
  'value' | 'defaultValue' | 'checked' | 'defaultChecked' | 'error'
> {
  name: string;
}

const FormSelectFeedback = forwardRef<HTMLSelectElement, FormSelectFeedbackProps>(
  ({ name, onChange, ...props }, ref) => {
    return (
      <FastField name={name}>
        {({ field, meta, form }: FastFieldProps) => (
          <SelectFeedback
            {...props}
            ref={ref}
            value={field.value}
            error={meta.error}
            onChange={composeHandlers(
              (event) => form.setFieldValue(name, event.target.value),
              onChange,
            )}
          />
        )}
      </FastField>
    );
  },
);
FormSelectFeedback.displayName = 'FormSelectFeedback';

export default FormSelectFeedback;
