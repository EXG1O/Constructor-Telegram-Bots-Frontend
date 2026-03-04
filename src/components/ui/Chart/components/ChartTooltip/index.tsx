import React, { forwardRef } from 'react';
import { Tooltip, type TooltipProps } from 'recharts';

import type {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

import TooltipContent, { type TooltipContentProps } from './components/TooltipContent';

export interface ChartTooltipProps
  extends
    Omit<TooltipProps<ValueType, NameType>, 'content'>,
    Pick<TooltipContentProps, 'title' | 'value'> {}

const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(
  ({ title, value, ...props }, ref) => {
    return (
      <Tooltip
        {...props}
        content={<TooltipContent ref={ref} title={title} value={value} />}
      />
    );
  },
);
ChartTooltip.displayName = 'ChartTooltip';

export default ChartTooltip;
