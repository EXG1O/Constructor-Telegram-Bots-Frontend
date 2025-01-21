import React, { HTMLAttributes, memo, ReactElement } from 'react';
import classNames from 'classnames';

export type BlockProps = HTMLAttributes<HTMLDivElement>;

function TableWrapper({ className, ...props }: BlockProps): ReactElement {
  return (
    <div
      {...props}
      className={classNames('text-bg-white border rounded-1', className)}
    />
  );
}

export default memo(TableWrapper);
