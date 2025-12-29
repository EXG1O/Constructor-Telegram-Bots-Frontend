import { InputHTMLAttributes } from 'react';
import { create } from 'zustand';

import { DEFAULT_SIZE, Size } from '.';

export interface StateParams
  extends Pick<
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
export type StateProps = Partial<Pick<StateParams, 'size' | 'invalid' | 'value'>> &
  Pick<StateParams, 'autoFocus' | 'inputMode' | 'placeholder' | 'onChange'>;

export function createStore({
  size = DEFAULT_SIZE,
  invalid = false,
  value = '',
  ...props
}: StateProps) {
  return create<State>((set, get) => ({
    ...props,

    size,
    invalid,
    value,

    setValue: (value) => {
      set({ value });
      get().onChange?.(value);
    },
  }));
}
