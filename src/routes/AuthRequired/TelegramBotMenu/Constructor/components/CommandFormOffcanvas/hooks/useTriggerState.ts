import { Dispatch, SetStateAction, useState } from 'react';

import { Trigger as BaseTrigger } from '../components/TriggerBlock';

type Trigger = BaseTrigger | undefined;

function useTriggerState(initialTrigger?: Trigger): [Trigger, Dispatch<SetStateAction<Trigger>>] {
	return useState<Trigger>(initialTrigger);
}

export default useTriggerState;