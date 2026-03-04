import type { FieldInputProps, FormikProps } from 'formik';
import { createStore as createZustandStore } from 'zustand';

export interface StateData {
  initialProps: InitialStoreProps;
  open: boolean;
  getOpen?: (field: FieldInputProps<any>, form: FormikProps<any>) => boolean;
}

export interface StateActions {
  setOpen: (open: StateData['open']) => void;
}

export type State = StateData & StateActions;
export type InitialStoreProps = Pick<StateData, 'getOpen'>;

export function createStore(initialProps: InitialStoreProps) {
  return createZustandStore<State>((set) => ({
    ...initialProps,

    initialProps,
    open: false,

    setOpen: (open) => set({ open }),
  }));
}
