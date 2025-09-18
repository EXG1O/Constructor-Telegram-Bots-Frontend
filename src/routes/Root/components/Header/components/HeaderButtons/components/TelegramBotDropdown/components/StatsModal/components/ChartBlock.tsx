import React, { forwardRef, useEffect, useState } from 'react';
import formatDate from 'i18n/formatDate';

import Block, { BlockProps } from 'components/ui/Block';
import Chart from 'components/ui/Chart';
import Spinner from 'components/ui/Spinner';

import cn from 'utils/cn';

export interface ChartBlockProps extends Omit<BlockProps, 'variant'> {
  title: string;
  getData: () => Promise<any[] | null>;
  xAxisDataKey?: string;
  yAxisDataKey?: string;
}

const ChartBlock = forwardRef<HTMLDivElement, ChartBlockProps>(
  (
    {
      title,
      getData,
      xAxisDataKey = 'date',
      yAxisDataKey = 'count',
      className,
      ...props
    },
    ref,
  ) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      (async () => {
        setLoading(true);

        const data: any[] | null = await getData();
        if (!data) return;

        setData(data);
        setLoading(false);
      })();
    }, []);

    function tickFormatter(value: string): string {
      return formatDate(value, 'd MMM');
    }

    return (
      <Block
        {...props}
        ref={ref}
        variant='light'
        className={cn('flex', 'flex-col', 'gap-2', className)}
      >
        <Block.Title>
          <h3 className='text-lg font-medium'>{title}</h3>
        </Block.Title>
        {!loading ? (
          <Chart height={240}>
            <Chart.Line data={data}>
              <Chart.XAxis dataKey={xAxisDataKey} tickFormatter={tickFormatter} />
              <Chart.YAxis />
              <Chart.Tooltip
                title={(data) =>
                  formatDate(data.label?.toString() ?? '', 'eeeeee, d MMM yyy')
                }
              />
              <Chart.Line.Cartesian dataKey={yAxisDataKey} />
              <Chart.Brush
                dataKey={xAxisDataKey}
                startIndex={data.length > 30 ? data.length - 30 : undefined}
                tickFormatter={tickFormatter}
              />
            </Chart.Line>
          </Chart>
        ) : (
          <div className='flex h-[240px] flex-auto items-center justify-center'>
            <Spinner size='sm' />
          </div>
        )}
      </Block>
    );
  },
);
ChartBlock.displayName = 'ChartBlock';

export default ChartBlock;
