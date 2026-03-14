import type { FieldInputProps, FormikProps } from 'formik';
import { createStore } from 'zustand';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

export interface StateData {
  open: boolean;
  getOpen?: (field: FieldInputProps<any>, form: FormikProps<any>) => boolean;
}

export interface StateActions {
  setOpen: (open: StateData['open']) => void;
}

export type State = BaseState<StoreProps> & StateData & StateActions;

export interface StoreProps extends Omit<StateData, 'open'> {}

export const [FormToggleSectionStoreProvider, useFormToggleSectionStore] =
  createZustandContext((props: StoreProps) =>
    createStore<State>((set) => ({
      ...props,

      open: false,

      syncFromProps: (props) => set(props),

      setOpen: (open) => set({ open }),
    })),
  );
