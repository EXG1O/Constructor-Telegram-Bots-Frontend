import React, { ReactElement, HTMLAttributes, memo, useState } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';
import Stack from 'react-bootstrap/esm/Stack';

export interface AddonButtonProps<Name extends string = string> extends Omit<ButtonProps, 'key' | 'size' | 'variant' | 'onClick'> {
	name: Name;
	onShow: () => void;
	onHide: () => void;
	children: string;
}

export interface AddonButtonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	addonButtons: AddonButtonProps[];
	showAddons: Record<string, boolean>;
}

function AddonButtonGroup({ addonButtons, showAddons, ...props }: AddonButtonGroupProps): ReactElement<AddonButtonGroupProps> {
	const [show, setShow] = useState<boolean>(false);

	return (
		<div {...props}>
			<Button
				size='sm'
				{...(
					show ? {
						variant: 'secondary',
						className: 'w-100 border-bottom-0 rounded-bottom-0',
						children: gettext('Скрыть дополнения'),
					} : {
						variant: 'dark',
						className: 'w-100',
						children: gettext('Показать дополнения'),
					}
				)}
				onClick={() => setShow(!show)}
			/>
			<Collapse in={show} unmountOnExit>
				<div>
					<Stack gap={1} className='border border-top-0 rounded-1 rounded-top-0 p-1'>
						{addonButtons.map(({ name, onShow, onHide, ...props }, index) => (
							<Button
								{...props}
								key={index}
								size='sm'
								variant={showAddons[name] ? 'secondary' : 'dark'}
								onClick={showAddons[name] ? onHide : onShow}
							/>
						))}
					</Stack>
				</div>
			</Collapse>
		</div>
	);
}

export default memo(AddonButtonGroup);