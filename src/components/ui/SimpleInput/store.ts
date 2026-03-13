import type { InputHTMLAttributes } from 'react';
import { createStore } from 'zustand';

import { DEFAULT_SIZE, type Size } from '.';

import createZustandContext, { type BaseState } from 'utils/createZustandContext';

export interface StateData extends Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'autoFocus' | 'inputMode' | 'placeholder'
> {
  size: Size;
  invalid: boolean;
  value: string;

  onChange?: (value: StateData['value']) => void;
}

export interface StateActions {
  setValue: (value: StateData['value']) => void;
}

export type State = BaseState<StoreProps> & StateData & StateActions;
export type StoreProps = Partial<StateData>;

function getData({
  size = DEFAULT_SIZE,
  invalid = false,
  value = '',
  ...rest
}: StoreProps): StateData {
  return { ...rest, size, invalid, value };
}

export const [SimpleInputStoreProvider, useSimpleInputStore] = createZustandContext(
  (props: StoreProps) =>
    createStore<State>((set, get) => ({
      ...getData(props),

      syncFromProps: ({ value: nextValue, ...props }) => {
        set(getData(props));

        if (nextValue !== undefined) {
          const { value, onChange } = get();

          if (nextValue !== value) {
            set({ value: nextValue });
            onChange?.(nextValue);
          }
        }
      },

      setValue: (value) => {
        set({ value });
        get().onChange?.(value);
      },
    })),
);
