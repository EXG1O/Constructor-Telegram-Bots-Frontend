import React, { ReactElement, HTMLAttributes, memo, useState } from 'react';
import classNames from 'classnames';

import InputGroup, { InputGroupProps } from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Collapse from 'react-bootstrap/Collapse';
import Button from 'react-bootstrap/Button';

export type Value = string;

export interface SearchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, Pick<InputGroupProps, 'size'> {
	onSearch: (value: Value) => void;
	onClear: () => void;
}

export const defaultValue: Value = '';

type RoundedValue = 1 | 2 | 3;

const roundedValues: Record<NonNullable<InputGroupProps['size']>, RoundedValue> = { 'sm': 1, 'lg': 3 };

function Search({ size, className, onSearch, onClear, ...props }: SearchProps): ReactElement<SearchProps> {
	const [value, setValue] = useState<Value>(defaultValue);

	const roundedValue: RoundedValue = size ? roundedValues[size] : 2;

	function handleClear(): void {
		setValue(defaultValue);
		onClear();
	}

	return (
		<div {...props} className={classNames('d-flex', className)}>
			<InputGroup size={size}>
				<i
					className={`d-flex align-items-center bi bi-search text-bg-light border rounded-start-${roundedValue} px-2`}
					style={{ fontSize: '14px' }}
				/>
				<FormControl
					value={value}
					placeholder={gettext('Поиск')}
					onChange={e => setValue(e.target.value)}
				/>
				<Collapse in={Boolean(value)} unmountOnExit dimension='width'>
					<div>
						<Button
							variant='light'
							className={`d-flex align-items-center bi bi-x border rounded-start-0 rounded-end-${roundedValue} h-100 p-0`}
							style={{ fontSize: '21px' }}
							onClick={handleClear}
						/>
					</div>
				</Collapse>
			</InputGroup>
			<div>
				<Collapse in={Boolean(value)} dimension='width'>
					<div>
						<Button
							size={size}
							variant='dark'
							className='ms-2'
							onClick={() => onSearch(value)}
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