import { ReactElement } from 'react';

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface State {
	toasts: ReactElement[];
}

export const useToastContainerStore = create<State>()(
	immer<State, [], []>(() => ({ toasts: [] })),
);
