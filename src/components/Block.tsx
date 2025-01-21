import React, { forwardRef, HTMLAttributes } from 'react';
import classNames from 'classnames';

import { AsProp, FCA } from 'utils/helpers';

export interface BlockProps extends AsProp, HTMLAttributes<HTMLDivElement> {
  variant?: string;
  gradient?: boolean;
}

const Block: FCA<'div', BlockProps> = forwardRef<HTMLElement, BlockProps>(
  function Block(
    { as: Component = 'div', variant = 'light', gradient, className, ...props },
    ref,
  ) {
    return (
      <Component
        ref={ref}
        className={classNames(className, `text-bg-${variant} rounded-4 p-3`, {
          'bg-gradient': gradient,
        })}
        {...props}
      />
    );
  },
);

export default Block;
