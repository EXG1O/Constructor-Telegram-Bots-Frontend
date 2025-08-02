import React, { forwardRef } from 'react';
import { XAxis, XAxisProps } from 'recharts';

export interface ChartXAxisProps extends Omit<XAxisProps, 'stoke'> {}

const ChartXAxis = forwardRef<XAxis, ChartXAxisProps>((props, ref) => {
  return (
    <XAxis
      height={26}
      interval='preserveStart'
      stroke='var(--color-foreground)'
      {...props}
      ref={ref}
    />
  );
});
ChartXAxis.displayName = 'ChartXAxis';

export default ChartXAxis;
