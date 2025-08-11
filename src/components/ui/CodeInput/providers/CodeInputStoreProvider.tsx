import React, { ReactElement, ReactNode, useEffect, useMemo } from 'react';
import isEqual from 'lodash/isEqual';

import { DEFAULT_SIZE } from '..';

import StoreContext from '../contexts/CodeInputStoreContext';

import { createStore, State, StateProps } from '../store';

export interface CodeInputStoreProviderProps extends StateProps {
  children: ReactNode;
}

function CodeInputStoreProvider({
  children,
  ...props
}: CodeInputStoreProviderProps): ReactElement {
  props.size ??= DEFAULT_SIZE;
  props.invalid ??= false;

  const store = useMemo(() => createStore(props), []);

  useEffect(() => {
    const state: State = store.getState();
    const stateProps: typeof props = {
      value: state.value,
      language: state.language,
      saveViewState: state.saveViewState,
      keepCurrentModel: state.keepCurrentModel,
      options: state.options,
      beforeMount: state.beforeMount,
      onMount: state.onMount,
      onChange: state.onChange,
      onValidate: state.onValidate,
    };
    if (isEqual(props, stateProps)) return;
    store.setState(props);
  }, [props]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default CodeInputStoreProvider;
