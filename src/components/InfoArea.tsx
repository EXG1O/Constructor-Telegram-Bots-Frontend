import React, {
	CSSProperties,
	HTMLAttributes,
	memo,
	ReactElement,
	useMemo,
} from 'react';
import classNames from 'classnames';

export interface InfoAreaProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	number: number;
	description: string;
}

const digitBlockStyle: CSSProperties = {
	fontSize: '18px',
	width: '36px',
	padding: '12px',
};

function InfoArea({
	number,
	description,
	className,
	...props
}: InfoAreaProps): ReactElement<InfoAreaProps> {
	const digitGroups = useMemo<string[][]>(() => {
		const digits: string[] = number.toString().split('');

		const remainder: number = digits.length % 3;
		const groups: string[][] = [];

		if (remainder > 0) {
			groups.push(digits.slice(0, remainder));
		}

		for (let index = remainder; index < digits.length; index += 3) {
			groups.push(digits.slice(index, index + 3));
		}

		return groups;
	}, [number]);

	return (
		<div {...props} className={classNames('text-center', className)}>
			<div className='d-flex justify-content-center gap-2'>
				{digitGroups.map((group, groupIndex) => (
					<div key={groupIndex} className='d-flex fw-semibold gap-1'>
						{group.map((digit, digitIndex) => (
							<div
								key={digitIndex}
								className='text-bg-white rounded'
								style={digitBlockStyle}
							>
								{digit}
							</div>
						))}
					</div>
				))}
			</div>
			<div>{description}</div>
		</div>
	);
}

export default memo(InfoArea);
