import React, { forwardRef } from 'react';
import { Brush, BrushProps } from 'recharts';

export interface ChartBrushProps
  extends Omit<BrushProps, 'height'>,
    Partial<Pick<BrushProps, 'height'>> {}

const ChartBrush = forwardRef<Brush, ChartBrushProps>((props, ref) => {
  return (
    <Brush height={30} stroke='var(--color-primary-accent)' {...props} ref={ref} />
  );
});
ChartBrush.displayName = 'ChartBrush';

export default ChartBrush;
