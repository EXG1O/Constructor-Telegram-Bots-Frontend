import React, { forwardRef, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { TooltipContentProps as PrimitiveTooltipContentProps } from 'recharts';

import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

import cn from 'utils/cn';

export const tooltipContentVariants = cva(
  [
    'flex',
    'flex-col',
    'bg-background',
    'text-foreground',
    'text-xs',
    'border',
    'border-outline',
    'rounded-sm',
    'shadow-sm',
    'px-1.5',
    'py-0.5',
  ],
  {
    variants: {
      active: {
        false: 'invisible',
      },
    },
  },
);

type TooltipData = Pick<TooltipContentProps, 'label' | 'payload'>;

export interface TooltipContentProps
  extends Partial<PrimitiveTooltipContentProps<ValueType, NameType>>,
    Omit<VariantProps<typeof tooltipContentVariants>, 'active'> {
  title?: ((data: TooltipData) => ReactNode) | ReactNode;
  value?: ((data: TooltipData) => ReactNode) | ReactNode;
}

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ active, label, payload, title, value }, ref) => {
    return (
      <div ref={ref} className={cn(tooltipContentVariants({ active }))}>
        {active && (
          <>
            <span className='w-full font-medium'>
              {title !== undefined
                ? typeof title === 'function'
                  ? title({ label, payload })
                  : title
                : label}
            </span>
            <span className='w-full text-muted'>
              {value !== undefined
                ? typeof value === 'function'
                  ? value({ label, payload })
                  : value
                : payload?.[0].value}
            </span>
          </>
        )}
      </div>
    );
  },
);
TooltipContent.displayName = 'TooltipContent';

export default TooltipContent;
