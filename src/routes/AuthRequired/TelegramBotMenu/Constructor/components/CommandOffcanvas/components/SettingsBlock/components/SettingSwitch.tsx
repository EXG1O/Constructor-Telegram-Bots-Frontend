import React, { ReactElement, memo } from 'react';

import { FormCheckProps as SwitchProps } from 'react-bootstrap/FormCheck';
import Switch from 'react-bootstrap/Switch';

import { Settings } from '..';

import useCommandOffcanvasStore from '../../../hooks/useCommandOffcanvasStore';

export interface SettingSwitchProps extends Omit<SwitchProps, 'checked' | 'onChange'> {
	settingName: keyof Settings;
}

function SettingSwitch({
	settingName,
	...props
}: SettingSwitchProps): ReactElement<SettingSwitchProps> {
	const checked = useCommandOffcanvasStore((state) => state.settings[settingName]);
	const updateSettings = useCommandOffcanvasStore((state) => state.updateSettings);

	return (
		<Switch
			{...props}
			checked={checked}
			onChange={(e) =>
				updateSettings((settings) => {
					settings[settingName] = e.target.checked;
				})
			}
		/>
	);
}

export default memo(SettingSwitch);
