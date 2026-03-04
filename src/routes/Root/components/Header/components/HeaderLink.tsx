import type { ReactElement } from 'react';
import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import cn from 'utils/cn';

export interface HeaderLinkProps extends LinkProps {}

function HeaderLink({ to, className, ...props }: HeaderLinkProps): ReactElement {
  return (
    <Link
      {...props}
      to={to}
      className={cn('text-foreground', 'text-nowrap', 'p-2', className)}
    />
  );
}

export default HeaderLink;
