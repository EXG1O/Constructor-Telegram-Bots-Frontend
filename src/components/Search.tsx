import React, { HTMLAttributes, memo, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Collapse from 'react-bootstrap/Collapse';

import Button from 'components/Button';
import InputGroup, { InputGroupProps } from 'components/InputGroup';

import Input from './Input';

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
	const { t } = useTranslation('components', { keyPrefix: 'search' });

	const [value, setValue] = useState<Value>(defaultValue);
	const [isActive, setActive] = useState<boolean>(false);

	const show: boolean = isActive || Boolean(value);

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
				<InputGroup.Text>
					<SearchIcon width={14} height='auto' />
				</InputGroup.Text>
				<Input
					value={value}
					placeholder={t('inputPlaceholder')}
					onChange={(e) => setValue(e.target.value)}
					onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
				/>
				<Collapse in={show} unmountOnExit dimension='width'>
					<div>
						<XIcon
							width={21}
							height='100%'
							cursor='pointer'
							className={classNames(
								'text-bg-light border border-start-0',
								{
									'rounded-end-1': size === 'sm',
									'rounded-end-2': size === undefined,
									'rounded-end-3': size === 'lg',
								},
							)}
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
							{t('button')}
						</Button>
					</div>
				</Collapse>
			</div>
		</div>
	);
}

export default memo(Search);
