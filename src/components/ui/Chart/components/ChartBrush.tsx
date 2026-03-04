import React, { ReactElement } from 'react';
import { Brush, BrushProps } from 'recharts';

export interface ChartBrushProps
  extends Omit<BrushProps, 'height'>, Partial<Pick<BrushProps, 'height'>> {}

function ChartBrush(props: ChartBrushProps): ReactElement {
  return <Brush height={30} stroke='var(--color-primary-accent)' {...props} />;
}

export default ChartBrush;
