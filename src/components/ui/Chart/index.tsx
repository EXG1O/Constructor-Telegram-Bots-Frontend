import React, { forwardRef } from 'react';
import { ResponsiveContainer, ResponsiveContainerProps } from 'recharts';

import ChartBrush from './components/ChartBrush';
import ChartLine from './components/ChartLine';
import ChartTooltip from './components/ChartTooltip';
import ChartXAxis from './components/ChartXAxis';
import ChartYAxis from './components/ChartYAxis';

import cn from 'utils/cn';

export interface ChartProps extends ResponsiveContainerProps {}

const Chart = forwardRef<HTMLDivElement, ChartProps>(({ className, ...props }, ref) => {
  return (
    <ResponsiveContainer {...props} ref={ref} className={cn('text-sm', className)} />
  );
});
Chart.displayName = 'Chart';

export default Object.assign(Chart, {
  Line: ChartLine,
  XAxis: ChartXAxis,
  YAxis: ChartYAxis,
  Tooltip: ChartTooltip,
  Brush: ChartBrush,
});
