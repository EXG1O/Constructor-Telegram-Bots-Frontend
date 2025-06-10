import React, { forwardRef, HTMLAttributes } from 'react';

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (props, ref) => {
    return <thead {...props} ref={ref} />;
  },
);
TableHeader.displayName = 'TableHeader';

export default TableHeader;
