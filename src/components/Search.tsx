import React, { ReactElement, HTMLAttributes, memo, useState } from 'react';

import classNames from 'classnames';

import Button from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Input from 'react-bootstrap/FormControl';
import InputGroup, { InputGroupProps } from 'react-bootstrap/InputGroup';

import SearchIcon from 'assets/icons/search.svg';
import XIcon from 'assets/icons/x.svg';

export type Value = string;

export interface SearchProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>,
		Pick<InputGroupProps, 'size'> {
	onSearch: (value: Value) => void;
	onClear: () => void;
}

export const defaultValue: Value = '';

function Search({
	size,
	className,
	onSearch,
	onClear,
	...props
}: SearchProps): ReactElement<SearchProps> {
	const [value, setValue] = useState<Value>(defaultValue);
	const [isActive, setActive] = useState<boolean>(false);

	const show: boolean = isActive || Boolean(value);
	const roundedValue: number = size === 'sm' ? 1 : size === 'lg' ? 3 : 2;

	function handleSearch(): void {
		onSearch(value);
		setActive(true);
	}

	function handleClear(): void {
		onClear();
		setActive(false);
		setValue(defaultValue);
	}

	return (
		<div {...props} className={classNames('d-flex', className)}>
			<InputGroup size={size}>
				<div
					className={`text-bg-light border rounded-start-${roundedValue} px-2`}
				>
					<SearchIcon width={14} height='100%' />
				</div>
				<Input
					value={value}
					placeholder={gettext('Поиск')}
					onChange={(e) => setValue(e.target.value)}
					onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<Collapse in={show} unmountOnExit dimension='width'>
					<div>
						<XIcon
							width={21}
							height='100%'
							className={`text-bg-light rounded-end-${roundedValue} border border-start-0`}
							style={{ cursor: 'pointer' }}
							onClick={handleClear}
						/>
					</div>
				</Collapse>
			</InputGroup>
			<div>
				<Collapse in={show} dimension='width'>
					<div>
						<Button
							size={size}
							variant='dark'
							className='ms-2'
							onClick={handleSearch}
						>
							{gettext('Найти')}
						</Button>
					</div>
				</Collapse>
			</div>
		</div>
	);
}

export default memo(Search);
