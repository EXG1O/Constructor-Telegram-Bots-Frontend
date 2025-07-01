import React, { ReactElement } from 'react';
import { useField } from 'formik';

import Tabs, { TabsProps } from 'components/ui/Tabs';

export type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface APIRequestMethodsProps extends Omit<TabsProps, 'size' | 'value'> {}

const methods: Method[] = ['get', 'post', 'put', 'patch', 'delete'];

export const defaultMethod: Method = 'get';

function APIRequestMethods({
  onChange,
  ...props
}: APIRequestMethodsProps): ReactElement {
  const [{ value }, _meta, { setValue }] = useField<Method>('api_request.method');

  function handleChange(value: string): void {
    setValue(value as Method);
    onChange?.(value);
  }

  return (
    <Tabs {...props} size='sm' value={value} onChange={handleChange}>
      {methods.map((method, index) => (
        <Tabs.Button key={index} value={method}>
          {method.toUpperCase()}
        </Tabs.Button>
      ))}
    </Tabs>
  );
}

export default APIRequestMethods;
