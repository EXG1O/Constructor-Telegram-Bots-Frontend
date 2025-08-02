import React, { forwardRef } from 'react';
import { XAxis, XAxisProps } from 'recharts';

export interface ChartXAxisProps extends Omit<XAxisProps, 'stoke'> {}

const ChartXAxis = forwardRef<XAxis, ChartXAxisProps>((props, ref) => {
  return (
    <XAxis
      height={22}
      interval='preserveStart'
      {...props}
      ref={ref}
      stroke='var(--color-foreground)'
    />
  );
});
ChartXAxis.displayName = 'ChartXAxis';

export default ChartXAxis;
