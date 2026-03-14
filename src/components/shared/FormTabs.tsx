import React, { forwardRef } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import Tabs, { type TabsProps } from 'components/ui/Tabs';

import composeHandlers from 'utils/composeHandlers';

export interface FormTabsProps extends Omit<
  TabsProps,
  'value' | 'defaultValue' | 'defaultChecked'
> {
  name: string;
}

const FormTabs = forwardRef<HTMLDivElement, FormTabsProps>(
  ({ name, onChange, ...props }, ref) => {
    return (
      <FastField name={name}>
        {({ field, form }: FastFieldProps) => (
          <Tabs
            {...props}
            ref={ref}
            value={field.value}
            onChange={composeHandlers(
              (value) => form.setFieldValue(name, value),
              onChange,
            )}
          />
        )}
      </FastField>
    );
  },
);
FormTabs.displayName = 'FormTabs';

export default FormTabs;
