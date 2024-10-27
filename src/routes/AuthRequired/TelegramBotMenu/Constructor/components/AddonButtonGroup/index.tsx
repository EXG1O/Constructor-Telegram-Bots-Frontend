import React, { HTMLAttributes, memo, ReactElement, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StoreApi, UseBoundStore } from 'zustand';

import Collapse from 'react-bootstrap/Collapse';

import Button, { ButtonProps } from 'components/Button';

import AddonButton, { AddonButtonProps } from './components/AddonButton';
import StoreContext from './contexts/StoreContext';

export interface AddonButtonGroupProps
	extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
	store: UseBoundStore<StoreApi<any>>;
	addonButtons: AddonButtonProps[];
}

export type { AddonButtonProps };

function AddonButtonGroup({
	store,
	addonButtons,
	...props
}: AddonButtonGroupProps): ReactElement<AddonButtonGroupProps> {
	const { t, i18n } = useTranslation('telegram-bot-menu-constructor', {
		keyPrefix: 'addonButtonGroup',
	});

	const [show, setShow] = useState<boolean>(false);

	const showButtonProps = useMemo<ButtonProps>(
		() => ({
			variant: 'dark',
			className: 'w-100',
			children: t('showButton'),
		}),
		[i18n.language],
	);
	const hideButtonProps = useMemo<ButtonProps>(
		() => ({
			variant: 'secondary',
			className: 'w-100 border-bottom-0 rounded-bottom-0',
			children: t('hideButton'),
		}),
		[i18n.language],
	);

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
