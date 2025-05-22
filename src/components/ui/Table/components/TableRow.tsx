import React, { forwardRef, HTMLAttributes } from 'react';

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>((props, ref) => {
  return <tr {...props} ref={ref} />;
});
TableRow.displayName = 'TableRow';

export default TableRow;
