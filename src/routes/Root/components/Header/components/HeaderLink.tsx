import React from 'react';
import { ReactElement } from 'react';
import { Link, LinkProps } from 'react-router-dom';

import cn from 'utils/cn';

export interface HeaderLinkProps extends LinkProps {}

function HeaderLink({ to, className, ...props }: HeaderLinkProps): ReactElement {
  return (
    <Link {...props} to={to} className={cn('text-foreground', 'p-2', className)} />
  );
}

export default HeaderLink;
