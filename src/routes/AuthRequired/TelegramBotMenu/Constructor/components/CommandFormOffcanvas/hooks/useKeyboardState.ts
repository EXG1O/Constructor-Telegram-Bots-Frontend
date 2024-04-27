import { Dispatch, SetStateAction, useState } from 'react';

import { Data as BaseData } from '../components/KeyboardBlock';

type Data = BaseData | undefined;

function useKeyboardState(initialData?: Data): [Data, Dispatch<SetStateAction<Data>>] {
	return useState<Data>(initialData);
}

export default useKeyboardState;