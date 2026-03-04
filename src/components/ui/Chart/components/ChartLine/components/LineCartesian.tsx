import React, { ReactElement } from 'react';
import { Line, LineProps } from 'recharts';
import { ActiveDotType } from 'recharts/types/util/types';

export interface LineCartesianProps extends Omit<LineProps, 'dot' | 'activeDot'> {}

const activeDot: ActiveDotType = { strokeWidth: 0, r: 4 };

function LineCartesian(props: LineCartesianProps): ReactElement {
  return (
    <Line
      stroke='var(--color-primary)'
      strokeWidth={2}
      {...props}
      dot={false}
      activeDot={activeDot}
    />
  );
}

export default LineCartesian;
