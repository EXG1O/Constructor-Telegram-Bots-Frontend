import React, { forwardRef, HTMLAttributes } from 'react';

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableBody = forwardRef<HTMLTableSectionElement, TableBodyProps>((props, ref) => {
  return <tbody {...props} ref={ref} />;
});
TableBody.displayName = 'TableBody';

export default TableBody;
