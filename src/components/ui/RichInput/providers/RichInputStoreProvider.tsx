import React, { ReactElement, ReactNode, useEffect, useMemo, useRef } from 'react';
import { useStore } from 'zustand';

import StoreContext from '../contexts/RichInputStoreContext';

import { createStore, StateProps } from '../store';

export interface RichInputStoreProviderProps extends StateProps {
  children: ReactNode;
}

function RichInputStoreProvider({
  readOnly,
  value,
  placeholder,
  children,
  ...props
}: RichInputStoreProviderProps): ReactElement {
  const storeJustCreated = useRef(true);

  const store = useMemo(() => {
    storeJustCreated.current = false;
    return createStore({ ...props });
  }, []);

  const toolbarElement = useStore(store, (state) => state.toolbarElement);
  const editorElement = useStore(store, (state) => state.editorElement);

  const quill = useStore(store, (state) => state.quill);
  const initQuill = useStore(store, (state) => state.initQuill);
  const setReadOnly = useStore(store, (state) => state.setReadOnly);
  const setValue = useStore(store, (state) => state.setValue);
  const setPlaceholder = useStore(store, (state) => state.setPlaceholder);

  useEffect(() => {
    if (!toolbarElement || !editorElement) return;
    initQuill();
  }, [toolbarElement, editorElement]);
  useEffect(() => {
    if (storeJustCreated.current) return;
    store.setState(props);
  }, [props]);
  useEffect(() => {
    if (storeJustCreated.current) return;
    setReadOnly(Boolean(readOnly));
  }, [readOnly]);
  useEffect(() => {
    if (storeJustCreated.current) return;
    setPlaceholder(placeholder ?? '');
  }, [placeholder]);
  useEffect(() => {
    if (!value || !quill || value === quill.getSemanticHTML()) return;
    setValue(value);
  }, [quill, value]);

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export default RichInputStoreProvider;
