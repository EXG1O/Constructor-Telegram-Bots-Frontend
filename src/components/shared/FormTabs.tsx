import React, { forwardRef } from 'react';
import { FastField, FastFieldProps, FormikProps } from 'formik';

import Tabs, { TabsProps } from 'components/ui/Tabs';

export interface FormTabsProps
  extends Omit<TabsProps, 'value' | 'defaultValue' | 'defaultChecked'> {
  name: string;
}

const FormTabs = forwardRef<HTMLDivElement, FormTabsProps>(
  ({ name, onChange, ...props }, ref) => {
    function handleChange(form: FormikProps<any>, value: string): void {
      form.setFieldValue(name, value);
      onChange?.(value);
    }

    return (
      <FastField name={name}>
        {({ field, form }: FastFieldProps) => (
          <Tabs
            {...props}
            ref={ref}
            value={field.value}
            onChange={(value) => handleChange(form, value)}
          />
        )}
      </FastField>
    );
  },
);
FormTabs.displayName = 'FormTabs';

export default FormTabs;
