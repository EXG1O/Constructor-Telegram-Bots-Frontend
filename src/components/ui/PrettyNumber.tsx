import React, { forwardRef, HTMLAttributes, useMemo } from 'react';
import { Slot } from '@radix-ui/react-slot';

import cn from 'utils/cn';

export interface PrettyNumberProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
  description: string;
  children: NonNullable<HTMLAttributes<HTMLDivElement>['children']>;
}

const PrettyNumber = forwardRef<HTMLDivElement, PrettyNumberProps>(
  ({ asChild, description, className, children, ...props }, ref) => {
    const Component = asChild ? Slot : 'div';

    const digitChunks = useMemo<string[][]>(() => {
      const digits: string[] = children.toString().split('');

      const remainder: number = digits.length % 3;
      const chunks: string[][] = [];

      if (remainder > 0) {
        chunks.push(digits.slice(0, remainder));
      }

      for (let index = remainder; index < digits.length; index += 3) {
        chunks.push(digits.slice(index, index + 3));
      }

      return chunks;
    }, [children]);

    return (
      <Component {...props} ref={ref} className={cn('text-center', className)}>
        <div className='flex justify-center gap-2'>
          {digitChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className='flex gap-1 font-semibold'>
              {chunk.map((digit, digitIndex) => (
                <div
                  key={digitIndex}
                  className='w-9 rounded-md bg-background p-3 text-lg text-foreground'
                >
                  {digit}
                </div>
              ))}
            </div>
          ))}
        </div>
        <span>{description}</span>
      </Component>
    );
  },
);
PrettyNumber.displayName = 'PrettyNumber';

export default PrettyNumber;
