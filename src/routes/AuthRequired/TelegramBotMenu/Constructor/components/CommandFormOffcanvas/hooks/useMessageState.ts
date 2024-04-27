import { Dispatch, SetStateAction, useState } from 'react';

import { Message, defaultMessage } from '../components/MessageBlock';

function useMessageState(initialMessage: Message = defaultMessage): [Message, Dispatch<SetStateAction<Message>>] {
	return useState<Message>(initialMessage);
}

export default useMessageState;