import { createContext } from 'react';

import { MessageToastProps } from 'components/MessageToast';

export interface ToastContextProps {
	createMessageToast: (props: MessageToastProps) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export default ToastContext;