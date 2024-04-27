import React, { ReactElement, ReactNode, memo, useMemo } from 'react';

import BasePagination, { PaginationProps as BasePaginationProps } from 'react-bootstrap/Pagination';

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
	const items = useMemo<ReactNode[] | undefined>(() => {
		const pageCount: number = Math.ceil(itemCount / itemLimit);
		const activePageNum: number = Math.ceil(itemOffset / itemLimit) + 1;

		return (
			pageCount > 1 ? (
				Array.from({ length: pageCount }, (_, pageNum) => {
					pageNum++;

					if (
						pageCount <= 7 ||
						pageNum === 1 || pageNum === pageCount ||
						pageNum <= 5 && activePageNum <= 5 && activePageNum !== 5 ||
						pageNum >= pageCount - 4 && activePageNum >= pageCount - 4 && activePageNum !== pageCount - 4 ||
						pageNum >= activePageNum - 1 && pageNum <= activePageNum + 1
					) {
						return (
							<BasePagination.Item
								key={pageNum}
								as='span'
								{...(
									activePageNum === pageNum ? {
										active: true,
									} : {
										onClick: () => onPageChange((pageNum - 1) * itemLimit),
									}
								)}
								style={{ cursor: 'pointer' }}
							>
								{pageNum}
							</BasePagination.Item>
						);
					} else if (pageNum === 2 || pageNum === pageCount - 2) {
						return (
							<BasePagination.Ellipsis
								key={pageNum}
								style={{
									cursor: 'default',
									pointerEvents: 'none',
								}}
							/>
						);
					}
				})
			) : []
		);
	}, [itemCount, itemLimit, itemOffset]);

	return (
		items?.length ? (
			<BasePagination {...props}>
				{items}
			</BasePagination>
		) : <></>
	);
}

export default memo(Pagination);