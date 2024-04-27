import { useContext } from 'react';

import ToastContext, { ToastContextProps } from 'services/contexts/ToastContext';

function useToast(): ToastContextProps {
	const context = useContext<ToastContextProps | undefined>(ToastContext);

	if (context === undefined) {
		throw new Error('useToast must be used with a ToastProvider!');
	}

	return context;
}

export default useToast;