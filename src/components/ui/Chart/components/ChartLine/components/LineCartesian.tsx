import React, { forwardRef } from 'react';
import { Line, LineProps } from 'recharts';
import { ActiveDotType } from 'recharts/types/util/types';

export interface LineCartesianProps extends Omit<LineProps, 'dot' | 'activeDot'> {}

const activeDot: ActiveDotType = { strokeWidth: 0, r: 4 };

const LineCartesian = forwardRef<Line, LineCartesianProps>((props, ref) => {
  return (
    <Line
      stroke='var(--color-primary)'
      strokeWidth={2}
      {...props}
      ref={ref}
      dot={false}
      activeDot={activeDot}
    />
  );
});
LineCartesian.displayName = 'LineCartesian';

export default LineCartesian;
