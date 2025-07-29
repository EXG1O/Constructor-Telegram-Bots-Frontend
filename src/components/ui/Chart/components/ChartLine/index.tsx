import React, { ComponentProps, forwardRef, useMemo } from 'react';
import { LineChart } from 'recharts';
import { Margin } from 'recharts/types/util/types';

import LineCartesian from './components/LineCartesian';

export interface ChartLineProps extends ComponentProps<typeof LineChart> {}

const ChartLine = forwardRef<SVGSVGElement, ChartLineProps>(
  ({ margin: extraMargin, ...props }, ref) => {
    const margin = useMemo<Margin>(
      () => ({ top: 4, bottom: 0, left: 0, right: 4, ...extraMargin }),
      [extraMargin],
    );

    return <LineChart ref={ref} {...props} margin={margin} />;
  },
);
ChartLine.displayName = 'ChartLine';

export default Object.assign(ChartLine, { Cartesian: LineCartesian });
