import React, { ReactElement, HTMLAttributes, memo, useState } from 'react';

import { UseBoundStore, StoreApi } from 'zustand';

import Button, { ButtonProps } from 'react-bootstrap/Button';
import Collapse from 'react-bootstrap/Collapse';

import AddonButton, { AddonButtonProps } from './components/AddonButton';

import StoreContext from './contexts/StoreContext';

export interface AddonButtonGroupProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	store: UseBoundStore<StoreApi<any>>;
	addonButtons: AddonButtonProps[];
}

export type { AddonButtonProps };

const showButtonProps: ButtonProps = {
	variant: 'dark',
	className: 'w-100',
	children: gettext('Показать дополнения'),
};
const hideButtonProps: ButtonProps = {
	variant: 'secondary',
	className: 'w-100 border-bottom-0 rounded-bottom-0',
	children: gettext('Скрыть дополнения'),
};

function AddonButtonGroup({
	store,
	addonButtons,
	...props
}: AddonButtonGroupProps): ReactElement<AddonButtonGroupProps> {
	const [show, setShow] = useState<boolean>(false);

	return (
		<div {...props}>
			<Button
				size='sm'
				{...(show ? hideButtonProps : showButtonProps)}
				onClick={() => setShow(!show)}
			/>
			<Collapse in={show}>
				<div>
					<div className='vstack bg-light border border-top-0 rounded-1 rounded-top-0 p-1 gap-1'>
						<StoreContext.Provider value={store}>
							{addonButtons.map((props, index) => (
								<AddonButton key={index} {...props} />
							))}
						</StoreContext.Provider>
					</div>
				</div>
			</Collapse>
		</div>
	);
}

export default memo(AddonButtonGroup);
