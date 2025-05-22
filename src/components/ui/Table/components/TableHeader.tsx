import React, { forwardRef, HTMLAttributes } from 'react';

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;

const TableHeader = forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (props, ref) => {
    return <thead {...props} ref={ref} />;
  },
);
TableHeader.displayName = 'TableHeader';

export default TableHeader;
