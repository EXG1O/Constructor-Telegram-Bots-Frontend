import { Dispatch, SetStateAction, useState } from 'react';

import { Settings, defaultSettings } from '../components/SettingsBlock';

function useSettingsState(initialSettings: Settings = defaultSettings): [Settings, Dispatch<SetStateAction<Settings>>] {
	return useState<Settings>(initialSettings);
}

export default useSettingsState;