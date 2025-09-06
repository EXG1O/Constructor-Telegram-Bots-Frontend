import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';

import { DEFAULT_SIZE } from '..';

import StoreContext from '../contexts/SimpleInputStoreContext';

import { createStore, State, StateProps } from '../store';

export interface SimpleInputStoreProviderProps extends StateProps {
  children: ReactNode;
}

function SimpleInputStoreProvider({
  children,
  ...props
}: SimpleInputStoreProviderProps): ReactElement {
  props.size ??= DEFAULT_SIZE;
  props.invalid ??= false;

  const store = useMemo(() => createStore(props), []);

  useEffect(() => {
    const state: State = store.getState();
    const stateProps: typeof props = {
      size: state.size,
      invalid: state.invalid,
      autoFocus: state.autoFocus,
      value: state.value,
      placeholder: state.placeholder,
      onChange: state.onChange,
    };
    if (isEqual(props, stateProps)) return;
    store.setState(props);
  }, [props]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default SimpleInputStoreProvider;
