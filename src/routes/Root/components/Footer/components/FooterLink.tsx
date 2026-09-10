import type { ReactElement } from 'react';
import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import cn from 'utils/cn';

export interface FooterLinkProps extends LinkProps {}

function FooterLink({ to, className, ...props }: FooterLinkProps): ReactElement {
  return (
    <Link
      {...props}
      to={to}
      className={cn('text-xs', 'text-muted', 'text-nowrap', className)}
    />
  );
}

export default FooterLink;
