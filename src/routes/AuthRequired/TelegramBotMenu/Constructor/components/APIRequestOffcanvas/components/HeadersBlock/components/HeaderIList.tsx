import React, { type HTMLAttributes, type ReactElement } from 'react';
import { FastField, type FastFieldProps } from 'formik';

import HeaderItem from './HeaderItem';

import cn from 'utils/cn';

import type { Headers } from '..';

export interface HeaderListProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {}

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
