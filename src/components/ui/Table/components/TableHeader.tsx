import React, { forwardRef, type HTMLAttributes } from 'react';

import TableHeaderContext from '../contexts/TableHeaderContext';

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (props, ref) => {
    return (
      <TableHeaderContext.Provider value={true}>
        <thead {...props} ref={ref} />
      </TableHeaderContext.Provider>
    );
  },
);
TableHeader.displayName = 'TableHeader';

export default TableHeader;
