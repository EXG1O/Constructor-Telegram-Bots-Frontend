import { create } from 'zustand';

import { DEFAULT_SIZE, Size } from '.';

export interface StateParams {
  size: Size;
  invalid: boolean;

  autoFocus?: boolean;
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

export interface StateActions {}

export type State = StateParams & StateActions;
export type StateProps = Partial<Pick<StateParams, 'size' | 'invalid'>> &
  Pick<StateParams, 'autoFocus' | 'value' | 'placeholder' | 'onChange'>;

export function createStore({
  size = DEFAULT_SIZE,
  invalid = false,
  ...props
}: StateProps) {
  return create<State>(() => ({ ...props, size, invalid }));
}
