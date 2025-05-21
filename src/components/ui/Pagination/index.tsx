import React, { forwardRef, HTMLAttributes } from 'react';

import PaginationItem, { paginationItemVariants } from './components/PaginationItem';

import cn from 'utils/cn';

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLUListElement>, 'children'> {
  size?: NonNullable<Parameters<typeof paginationItemVariants>[0]>['size'];
  itemCount: number;
  itemLimit: number;
  itemOffset: number;
  onPageChange: (newItemOffset: number) => void;
}

const Pagination = forwardRef<HTMLUListElement, PaginationProps>(
  (
    { size, itemCount, itemLimit, itemOffset, className, onPageChange, ...props },
    ref,
  ) => {
    const pageCount: number = Math.ceil(itemCount / itemLimit);
    const activePage: number = Math.ceil(itemOffset / itemLimit) + 1;

    return (
      pageCount > 1 && (
        <ul {...props} ref={ref} className={cn('flex', className)}>
          {Array.from({ length: pageCount }, (_, index) => {
            const page = index + 1;

            if (
              pageCount <= 7 ||
              page === 1 ||
              page === pageCount ||
              (page <= 5 && activePage <= 5 && activePage !== 5) ||
              (page >= pageCount - 4 &&
                activePage >= pageCount - 4 &&
                activePage !== pageCount - 4) ||
              (page >= activePage - 1 && page <= activePage + 1)
            ) {
              return (
                <PaginationItem
                  key={page}
                  size={size}
                  active={page === activePage}
                  onClick={() => onPageChange((page - 1) * itemLimit)}
                >
                  {page}
                </PaginationItem>
              );
            } else if (page === 2 || page === pageCount - 2) {
              return (
                <PaginationItem
                  key={page}
                  size={size}
                  className='pointer-events-none cursor-default'
                >
                  ...
                </PaginationItem>
              );
            }
          })}
        </ul>
      )
    );
  },
);
Pagination.displayName = 'Pagination';

export default Pagination;
