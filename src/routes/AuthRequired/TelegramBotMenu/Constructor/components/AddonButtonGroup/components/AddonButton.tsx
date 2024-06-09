import React, { ReactElement, memo } from 'react';

import Button, { ButtonProps } from 'react-bootstrap/Button';

import useAddonButtonGroupStore from '../hooks/useAddonButtonGroupStore';

export interface AddonButtonProps<State = any>
	extends Omit<ButtonProps, 'key' | 'size' | 'variant' | 'onClick'> {
	stateName: keyof State;
	actionName: keyof State;
	children: string;
}

type Show = boolean;
type SetShow = (show: boolean) => void;

function AddonButton({
	stateName,
	actionName,
	...props
}: AddonButtonProps): ReactElement<AddonButtonProps> {
	const show = useAddonButtonGroupStore<Show>((state) => state[stateName]);
	const setShow = useAddonButtonGroupStore<SetShow>((state) => state[actionName]);

	return (
		<Button
			{...props}
			size='sm'
			variant={show ? 'secondary' : 'dark'}
			onClick={() => setShow(!show)}
		/>
	);
}

export default memo(AddonButton);
