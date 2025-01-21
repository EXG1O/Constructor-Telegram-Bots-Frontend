import React, { memo, ReactElement } from 'react';

import BasePagination, {
  PaginationProps as BasePaginationProps,
} from 'react-bootstrap/Pagination';

import('./Pagination.scss');

export interface PaginationProps extends Omit<BasePaginationProps, 'children'> {
  itemCount: number;
  itemLimit: number;
  itemOffset: number;
  onPageChange: (newItemOffset: number) => void;
}

function Pagination({
  itemCount,
  itemLimit,
  itemOffset,
  onPageChange,
  ...props
}: PaginationProps): ReactElement<PaginationProps> {
  const pageCount: number = Math.ceil(itemCount / itemLimit);
  const activePage: number = Math.ceil(itemOffset / itemLimit) + 1;

  return pageCount > 1 ? (
    <BasePagination {...props}>
      {Array.from({ length: pageCount }, (_, page) => {
        page++;

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
            <BasePagination.Item
              key={page}
              as='span'
              {...(activePage === page
                ? { active: true }
                : {
                    onClick: () => onPageChange((page - 1) * itemLimit),
                  })}
              style={{ cursor: 'pointer' }}
            >
              {page}
            </BasePagination.Item>
          );
        } else if (page === 2 || page === pageCount - 2) {
          return (
            <BasePagination.Ellipsis
              key={page}
              style={{
                cursor: 'default',
                pointerEvents: 'none',
              }}
            />
          );
        }
      })}
    </BasePagination>
  ) : (
    <></>
  );
}

export default memo(Pagination);
