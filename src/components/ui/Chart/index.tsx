import React, { forwardRef } from 'react';
import { ResponsiveContainer, ResponsiveContainerProps } from 'recharts';

import ChartLine from './components/ChartLine';
import ChartTooltip from './components/ChartTooltip';
import ChartXAxis from './components/ChartXAxis';
import ChartYAxis from './components/ChartYAxis';

export interface ChartProps extends ResponsiveContainerProps {}

const Chart = forwardRef<HTMLDivElement, ChartProps>((props, ref) => {
  return <ResponsiveContainer {...props} ref={ref} />;
});
Chart.displayName = 'Chart';

export default Object.assign(Chart, {
  Line: ChartLine,
  XAxis: ChartXAxis,
  YAxis: ChartYAxis,
  Tooltip: ChartTooltip,
});
