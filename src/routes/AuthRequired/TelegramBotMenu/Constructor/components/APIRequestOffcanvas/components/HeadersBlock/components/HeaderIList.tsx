import React, { HTMLAttributes, ReactElement } from 'react';
import { FastField, FastFieldProps } from 'formik';

import { Headers } from '..';

import HeaderItem from './HeaderItem';

import cn from 'utils/cn';

export interface HeaderListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function HeaderList({ className, ...props }: HeaderListProps): ReactElement {
  return (
    <FastField name='headers'>
      {({ field }: FastFieldProps) => {
        const headers: Headers = field.value;

        return headers.length ? (
          <div
            {...props}
            className={cn('flex', 'flex-col', 'w-full', 'gap-1', className)}
          >
            {headers.map((_header, index) => (
              <HeaderItem key={index} index={index} />
            ))}
          </div>
        ) : null;
      }}
    </FastField>
  );
}

export default HeaderList;
