import React, { HTMLAttributes, ReactElement } from 'react';
import { useField } from 'formik';

import { Headers } from '..';

import HeaderItem from './HeaderItem';

import cn from 'utils/cn';

export interface HeaderListProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function HeaderList({ className, ...props }: HeaderListProps): ReactElement | null {
  const [{ value: headers }] = useField<Headers>('headers');

  return headers.length ? (
    <div {...props} className={cn('flex', 'flex-col', 'w-full', 'gap-1', className)}>
      {headers.map((_header, index) => (
        <HeaderItem key={index} index={index} />
      ))}
    </div>
  ) : null;
}

export default HeaderList;
