import { Dispatch, SetStateAction, useState } from 'react';

import { Value, defaultValue } from '../../NameBlock';

function useNameState(initialValue: Value = defaultValue): [Value, Dispatch<SetStateAction<Value>>] {
	return useState<Value>(initialValue);
}

export default useNameState;