import type { ReactElement } from 'react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface ToastProps {
  id: string;
}

interface State {
  toasts: ReactElement<ToastProps>[];
}

export const useToastContainerStore = create<State>()(
  immer<State, [], []>(() => ({ toasts: [] })),
);
