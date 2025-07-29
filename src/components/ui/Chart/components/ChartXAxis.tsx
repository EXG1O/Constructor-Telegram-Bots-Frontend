import React, { forwardRef } from 'react';
import { XAxis, XAxisProps } from 'recharts';

export interface ChartXAxisProps extends Omit<XAxisProps, 'interval' | 'stoke'> {}

const ChartXAxis = forwardRef<XAxis, ChartXAxisProps>((props, ref) => {
  return (
    <XAxis
      height={22}
      tickMargin={4}
      {...props}
      ref={ref}
      interval={6}
      stroke='var(--color-foreground)'
    />
  );
});
ChartXAxis.displayName = 'ChartXAxis';

export default ChartXAxis;
