import React, { forwardRef } from 'react';
import { YAxis, type YAxisProps } from 'recharts';
import type { AxisDomain } from 'recharts/types/util/types';

export interface ChartYAxisProps extends Omit<YAxisProps, 'stroke'> {}

export const defaultDomain: AxisDomain = ['dataMin', 'dataMax'];

const ChartYAxis = forwardRef<YAxis, ChartYAxisProps>((props, ref) => {
  return (
    <YAxis
      width='auto'
      domain={defaultDomain}
      stroke='var(--color-foreground)'
      {...props}
      ref={ref}
    />
  );
});
ChartYAxis.displayName = 'ChartYAxis';

export default ChartYAxis;
