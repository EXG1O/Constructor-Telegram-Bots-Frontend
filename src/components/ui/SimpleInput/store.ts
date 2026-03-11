import type { InputHTMLAttributes } from 'react';
import { create } from 'zustand';

import type { Size } from '.';

export interface StateParams extends Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'autoFocus' | 'inputMode' | 'placeholder'
> {
  size: Size;
  invalid: boolean;
  value: string;

  onChange?: (value: string) => void;
}

export interface StateActions {
  setValue: (value: string) => void;
}

export type State = StateParams & StateActions;
export type StateProps = Partial<Pick<StateParams, 'value'>> &
  Pick<
    StateParams,
    'size' | 'invalid' | 'autoFocus' | 'inputMode' | 'placeholder' | 'onChange'
  >;

export function createStore({ value = '', ...props }: StateProps) {
  return create<State>((set, get) => ({
    ...props,

    value,

    setValue: (nextValue) => {
      const { value, onChange } = get();

      if (nextValue !== value) {
        set({ value: nextValue });
        onChange?.(nextValue);
      }
    },
  }));
}
