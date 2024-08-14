import React, { HTMLAttributes, memo, ReactElement, useCallback } from 'react';
import classNames from 'classnames';

import Pagination from 'components/Pagination';
import Search, { defaultValue as searchDefaultValue } from 'components/Search';

import TypeToggleButtonGroup from './components/TypeToggleButtonGroup';

import useUsersStore from '../../hooks/useUsersStore';

export interface ToolbarProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {}

function Toolbar({ className, ...props }: ToolbarProps): ReactElement<ToolbarProps> {
	const itemCount = useUsersStore((state) => state.count);
	const itemLimit = useUsersStore((state) => state.limit);
	const itemOffset = useUsersStore((state) => state.offset);
	const updateUsers = useUsersStore((state) => state.updateUsers);

	return (
		<div {...props} className={classNames('row row-cols-lg-auto g-2', className)}>
			<TypeToggleButtonGroup />
			<Search
				size='sm'
				className='flex-fill'
				onSearch={useCallback(
					(value) => updateUsers(undefined, undefined, value),
					[],
				)}
				onClear={useCallback(
					() => updateUsers(undefined, undefined, searchDefaultValue),
					[],
				)}
			/>
			<Pagination
				size='sm'
				itemCount={itemCount}
				itemLimit={itemLimit}
				itemOffset={itemOffset}
				className='justify-content-center ps-1'
				onPageChange={useCallback(
					(newOffset) => updateUsers(undefined, newOffset),
					[],
				)}
			/>
		</div>
	);
}

export default memo(Toolbar);
