import React, { HTMLAttributes, ReactElement, useMemo } from 'react';

import SelectButton from '../../SelectButton';

import { DatabaseRecord } from 'api/telegram-bots/database-record/types';

import cn from 'utils/cn';
import getJSONPathLines, { JSONPath } from 'utils/getJSONPathLines';

export interface RecordDataProps
  extends
    Pick<DatabaseRecord, 'data'>,
    Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  appliedSearch: string | null;
}

function RecordData({
  appliedSearch,
  data,
  className,
  ...props
}: RecordDataProps): ReactElement {
  const jsonLines = useMemo<string[]>(
    () => JSON.stringify(data, null, 2).split('\n'),
    [data],
  );
  const jsonPathLines = useMemo<JSONPath[]>(() => getJSONPathLines(data), [data]);

  return (
    <div
      {...props}
      className={cn(
        'w-full',
        'font-mono',
        'rounded-sm',
        'whitespace-pre',
        'overflow-hidden',
        className,
      )}
    >
      {jsonLines.map((value, lineIndex) => {
        const path: string | null = jsonPathLines[lineIndex];

        return (
          <div key={lineIndex} className='flex w-full gap-1 even:bg-foreground/5'>
            <span className='flex-auto overflow-x-auto scrollbar-thin'>{value}</span>
            {path && (
              <SelectButton
                variable={[
                  'DATABASE',
                  ...(appliedSearch ? [`[search=${appliedSearch}]`] : []),
                  path,
                ].join('.')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default RecordData;
