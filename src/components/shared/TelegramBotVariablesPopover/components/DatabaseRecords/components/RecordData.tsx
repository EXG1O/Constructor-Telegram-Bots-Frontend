import React, { HTMLAttributes, ReactElement, useMemo } from 'react';

import SelectButton from '../../SelectButton';

import { DatabaseRecord } from 'api/telegram-bots/database-record/types';

import cn from 'utils/cn';
import getJSONPathLines, { JSONPath } from 'utils/getJSONPathLines';

export interface RecordDataProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  record: DatabaseRecord;
}

function RecordData({ record, className, ...props }: RecordDataProps): ReactElement {
  const jsonDataLines = useMemo<string[]>(
    () => JSON.stringify(record.data, null, 2).split('\n'),
    [record.data],
  );
  const pathLines = useMemo<JSONPath[]>(
    () => getJSONPathLines(record.data),
    [record.data],
  );

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
      {jsonDataLines.map((value, lineIndex) => {
        const path: string | null = pathLines[lineIndex];

        return (
          <div key={lineIndex} className='flex gap-1 even:bg-foreground/5'>
            <span className='flex-auto overflow-x-auto scrollbar-thin'>{value}</span>
            {path && <SelectButton variable={path} />}
          </div>
        );
      })}
    </div>
  );
}

export default RecordData;
