import React, {
  type DetailedHTMLProps,
  type HTMLAttributes,
  type ReactElement,
} from 'react';

import cn from 'utils/cn';

export interface FooterCopyrightProps extends Omit<
  DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>,
  'children'
> {}

function FooterCopyright({ className, ...props }: FooterCopyrightProps): ReactElement {
  return (
    <span
      {...props}
      className={cn('w-full', 'text-foreground', 'text-nowrap', className)}
    >
      &copy; 2026 exg1o
    </span>
  );
}

export default FooterCopyright;
