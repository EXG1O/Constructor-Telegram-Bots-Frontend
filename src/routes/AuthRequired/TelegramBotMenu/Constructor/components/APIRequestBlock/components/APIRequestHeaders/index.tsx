import React, { HTMLAttributes, ReactElement } from 'react';
import { useField } from 'formik';

import AddHeaderButton from './components/AddHeaderButton';
import HeaderInputGroup from './components/HeaderItem';
import ToggleSection from './components/ToggleSection';

import cn from 'utils/cn';

export interface Header {
  key: string;
  value: string;
}
export type Headers = Header[];

export interface APIRequestHeadersProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

export const defaultHeaders: Headers = [];

function APIRequestHeaders({
  className,
  ...props
}: APIRequestHeadersProps): ReactElement {
  const [{ value: headers }] = useField<Header[]>('api_request.headers');

  return (
    <div
      {...props}
      className={cn(
        'flex',
        'flex-col',
        'w-full',
        'bg-light-accent',
        'rounded-sm',
        'rounded-t-none',
        'p-1',
        'gap-1',
        className,
      )}
    >
      {headers.map((_header, index) => (
        <HeaderInputGroup key={index} index={index} />
      ))}
      <AddHeaderButton />
    </div>
  );
}

export default Object.assign(APIRequestHeaders, { ToggleSection });
