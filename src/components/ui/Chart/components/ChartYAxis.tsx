import React, { forwardRef } from 'react';
import { YAxis, YAxisProps } from 'recharts';
import { AxisDomain } from 'recharts/types/util/types';

export interface ChartYAxisProps extends Omit<YAxisProps, 'stroke'> {}

export const defaultDomain: AxisDomain = ['dataMin', 'dataMax'];

const ChartYAxis = forwardRef<YAxis, ChartYAxisProps>((props, ref) => {
  return (
    <YAxis
      width='auto'
      domain={defaultDomain}
      {...props}
      ref={ref}
      stroke='var(--color-foreground)'
    />
  );
});
ChartYAxis.displayName = 'ChartYAxis';

export default ChartYAxis;
